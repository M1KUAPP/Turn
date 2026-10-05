import AVFAudio
import CoreMedia
import Foundation
import Speech

@MainActor
final class ListenEngine {
  private static let silenceWindowMs = 500
  private static let silenceWindowNanoseconds: UInt64 = 500_000_000
  private static let resultFinalizationTimeoutNanoseconds: UInt64 = 1_000_000_000
  private static let silenceFlushSeconds = 0.25
  private static let silenceFlushLimitSeconds = 3.0
  private static let minimumVoiceSeconds = 0.3
  private static let voiceRmsThreshold = 0.015

  private struct ResultWaiter {
    let through: CMTime
    let continuation: CheckedContinuation<Void, Never>
    var timeoutTask: Task<Void, Never>?
  }

  private enum SelectedTranscriber {
    case speech(SpeechTranscriber, AssetInventory.Status)
    case dictation(DictationTranscriber, AssetInventory.Status)

    var modules: [any SpeechModule] {
      switch self {
      case .speech(let transcriber, _):
        return [transcriber]
      case .dictation(let transcriber, _):
        return [transcriber]
      }
    }

    var status: AssetInventory.Status {
      switch self {
      case .speech(_, let status), .dictation(_, let status):
        return status
      }
    }
  }

  private final class AudioTimeline {
    private let lock = NSLock()
    private var nextTime = CMTime.zero

    func advance(frameCount: AVAudioFrameCount, sampleRate: Double) {
      lock.lock()
      defer { lock.unlock() }
      let duration = CMTime(
        value: Int64(frameCount),
        timescale: CMTimeScale(Int32(sampleRate.rounded()))
      )
      nextTime = CMTimeAdd(nextTime, duration)
    }

    func reset() {
      lock.lock()
      defer { lock.unlock() }
      nextTime = .zero
    }

    var end: CMTime {
      lock.lock()
      defer { lock.unlock() }
      return nextTime
    }
  }

  private let timeline = AudioTimeline()
  private let onPartial: @MainActor (String) -> Void
  private let onLine: @MainActor (String, Double, Int) -> Void
  private let onState: @MainActor (String, String?) -> Void
  private let onAssetProgress: @MainActor (Double?) -> Void
  private let onVoice: @MainActor (Bool) -> Void

  private var selectedTranscriber: SelectedTranscriber?
  private var analyzer: SpeechAnalyzer?
  private var analyzerFormat: AVAudioFormat?
  private var inputBuilder: AsyncStream<AnalyzerInput>.Continuation?
  private var audioEngine: AVAudioEngine?
  private var inputNode: AVAudioInputNode?
  private var audioConverter: AVAudioConverter?
  private var resultTask: Task<Void, Never>?
  private var progressTask: Task<Void, Never>?
  private var silenceTask: Task<Void, Never>?
  private var muteTask: Task<Void, Never>?
  private var muteGeneration = 0
  private var interruptionObservers: [NSObjectProtocol] = []
  private var configurationChangeObserver: NSObjectProtocol?
  private var listenMode = false
  private var tapInstalled = false
  private var capturing = false
  private var voiceActive = false
  // How long the partner's voice has been above the speech level since the last line ended, and where in the audio it
  // last fell.
  private var voicedSeconds = 0.0
  private var voiceEndedAt = CMTime.zero
  private var silenceWindowPending = false
  private var lineFinalizing = false
  private var finalizeReturned = false
  private var finalizedText = ""
  private var volatileText = ""
  private var latestResultsFinalizationTime = CMTime.zero
  private var renderedText = ""
  private var resultWaiters: [UUID: ResultWaiter] = [:]

  isolated deinit {
    releaseMute()
    removeInterruptionObservers()
    removeConfigurationChangeObserver()
  }

  init(
    onPartial: @escaping @MainActor (String) -> Void,
    onLine: @escaping @MainActor (String, Double, Int) -> Void,
    onState: @escaping @MainActor (String, String?) -> Void,
    onAssetProgress: @escaping @MainActor (Double?) -> Void,
    onVoice: @escaping @MainActor (Bool) -> Void
  ) {
    self.onPartial = onPartial
    self.onLine = onLine
    self.onState = onState
    self.onAssetProgress = onAssetProgress
    self.onVoice = onVoice
  }

  func availability() async -> String {
    guard let selected = await chooseTranscriber() else {
      selectedTranscriber = nil
      return "none"
    }
    selectedTranscriber = selected
    return Self.portStatus(for: selected.status)
  }

  func installAsset() async throws {
    guard let selected = await currentTranscriber() else { return }
    let status = await AssetInventory.status(forModules: selected.modules)

    switch status {
    case .installed:
      onAssetProgress(nil)
      return
    case .supported, .downloading:
      guard let request = try await AssetInventory.assetInstallationRequest(
        supporting: selected.modules
      ) else {
        let latestStatus = await AssetInventory.status(forModules: selected.modules)
        guard case .installed = latestStatus else {
          throw ListenEngineFailure.assetRequestUnavailable
        }
        onAssetProgress(nil)
        return
      }

      let progress = request.progress
      progressTask?.cancel()
      progressTask = Task { @MainActor [weak self] in
        guard let self else { return }
        while !Task.isCancelled {
          self.onAssetProgress(progress.fractionCompleted)
          if progress.isFinished { break }
          do {
            try await Task.sleep(nanoseconds: 100_000_000)
          } catch {
            break
          }
        }
      }

      do {
        try await request.downloadAndInstall()
      } catch {
        progressTask?.cancel()
        progressTask = nil
        onAssetProgress(nil)
        throw error
      }
      progressTask?.cancel()
      progressTask = nil
      let installedStatus = await AssetInventory.status(forModules: selected.modules)
      guard case .installed = installedStatus else {
        onAssetProgress(nil)
        throw ListenEngineFailure.modelNotInstalled
      }
      onAssetProgress(nil)
    case .unsupported:
      throw ListenEngineFailure.modelUnsupported
    @unknown default:
      throw ListenEngineFailure.modelUnsupported
    }
  }

  func start() async throws {
    guard analyzer == nil else { return }
    onState("starting", nil)

    do {
      guard let selected = await currentTranscriber() else {
        throw ListenEngineFailure.transcriberUnavailable
      }
      guard await AVAudioApplication.requestRecordPermission() else {
        throw ListenEngineFailure.microphoneDenied
      }

      let assetStatus = await AssetInventory.status(forModules: selected.modules)
      if case .installed = assetStatus {
        onAssetProgress(nil)
      } else {
        try await installAsset()
      }

      let analyzer = SpeechAnalyzer(modules: selected.modules)
      guard let analyzerFormat = await SpeechAnalyzer.bestAvailableAudioFormat(
        compatibleWith: selected.modules
      ) else {
        throw ListenEngineFailure.noAudioFormat
      }
      try await analyzer.prepareToAnalyze(in: analyzerFormat)

      let (inputSequence, inputBuilder) = AsyncStream<AnalyzerInput>.makeStream()
      self.analyzer = analyzer
      self.analyzerFormat = analyzerFormat
      self.inputBuilder = inputBuilder
      startResultConsumer(for: selected)
      try await analyzer.start(inputSequence: inputSequence)
      try startCapture()
      onState("listening", nil)
    } catch {
      removeCapture()
      removeInterruptionObservers()
      inputBuilder?.finish()
      inputBuilder = nil
      if let analyzer {
        try? await analyzer.finalizeAndFinishThroughEndOfInput()
      }
      resultTask?.cancel()
      resultTask = nil
      analyzer = nil
      analyzerFormat = nil
      selectedTranscriber = nil
      clearTranscript()
      timeline.reset()
      latestResultsFinalizationTime = .zero
      let reason = String(describing: error)
      onState("unavailable", reason)
      throw error
    }
  }

  func pause(reason: String? = nil) async throws {
    guard analyzer != nil, capturing else { return }
    removeCapture()
    silenceTask?.cancel()
    silenceTask = nil
    silenceWindowPending = false
    // A line already finalizing waits for audio past its boundary, which no longer comes.
    var flushed = 0.0
    while lineFinalizing, flushed < Self.silenceFlushLimitSeconds {
      flushSilence()
      flushed += Self.silenceFlushSeconds
      try? await Task.sleep(nanoseconds: 20_000_000)
    }
    do {
      try await finishCurrentAudio(publishLine: false)
      clearTranscript()
      onState("paused", reason)
    } catch {
      onState("unavailable", String(describing: error))
      throw error
    }
  }

  func resume() throws {
    guard analyzer != nil, !capturing else { return }
    do {
      try startCapture()
      onState("listening", nil)
    } catch {
      onState("unavailable", String(describing: error))
      throw error
    }
  }

  func stop() async throws {
    releaseMute()
    removeInterruptionObservers()
    removeConfigurationChangeObserver()
    guard analyzer != nil else {
      onState("idle", nil)
      return
    }
    onState("stopping", nil)
    silenceTask?.cancel()
    silenceTask = nil
    removeCapture()
    inputBuilder?.finish()
    inputBuilder = nil

    do {
      try await analyzer?.finalizeAndFinishThroughEndOfInput()
      await resultTask?.value
      resultTask = nil
      analyzer = nil
      analyzerFormat = nil
      selectedTranscriber = nil
      clearTranscript()
      removeConfigurationChangeObserver()
      audioEngine = nil
      inputNode = nil
      audioConverter = nil
      timeline.reset()
      latestResultsFinalizationTime = .zero
      onState("idle", nil)
    } catch {
      analyzer = nil
      selectedTranscriber = nil
      clearTranscript()
      removeConfigurationChangeObserver()
      audioEngine = nil
      inputNode = nil
      audioConverter = nil
      timeline.reset()
      latestResultsFinalizationTime = .zero
      onState("unavailable", String(describing: error))
      throw error
    }
  }

  func endLine() async throws {
    silenceTask?.cancel()
    silenceTask = nil
    try await finishCurrentAudio(publishLine: true)
  }

  func setListenMode(_ active: Bool) throws {
    listenMode = active
    try Self.setListenModeCategory(active)
  }

  private static func setListenModeCategory(_ active: Bool) throws {
    let session = AVAudioSession.sharedInstance()
    let category: AVAudioSession.Category = active ? .playAndRecord : .playback
    let mode: AVAudioSession.Mode = .default
    let options: AVAudioSession.CategoryOptions = active ? [.defaultToSpeaker] : []

    if session.category == category && session.mode == mode && session.categoryOptions == options {
      return
    }

    try session.setCategory(category, mode: mode, options: options)
  }

  func muteForSpeech(_ muted: Bool) throws {
    muteGeneration &+= 1
    muteTask?.cancel()
    muteTask = nil

    if muted {
      try AVAudioApplication.shared.setInputMuted(true)
    } else {
      let generation = muteGeneration
      let latency = AVAudioSession.sharedInstance().outputLatency
      let nanoseconds = (latency.isFinite && latency > 0)
        ? UInt64((latency * 1_000_000_000).rounded())
        : 0
      muteTask = Task { @MainActor [weak self] in
        // Wait for the speaker's output latency so Turn does not hear the tail of its own speech.
        do {
          try await Task.sleep(nanoseconds: nanoseconds)
        } catch {
          return
        }
        guard let self, !Task.isCancelled, self.muteGeneration == generation else { return }
        try? AVAudioApplication.shared.setInputMuted(false)
      }
    }
  }

  private func releaseMute() {
    muteGeneration &+= 1
    muteTask?.cancel()
    muteTask = nil
    try? AVAudioApplication.shared.setInputMuted(false)
  }

  private func currentTranscriber() async -> SelectedTranscriber? {
    if let selectedTranscriber { return selectedTranscriber }
    guard let selected = await chooseTranscriber() else { return nil }
    selectedTranscriber = selected
    return selected
  }

  private func chooseTranscriber() async -> SelectedTranscriber? {
    let requestedLocale = Locale(identifier: "en-US")

    #if DEBUG
    // Add -TurnListenForceDictationTranscriber to the Debug launch arguments to test the fallback.
    if ProcessInfo.processInfo.arguments.contains("-TurnListenForceDictationTranscriber") {
      return await dictationTranscriber(for: requestedLocale)
    }
    #endif

    if let speech = await speechTranscriber(for: requestedLocale) {
      return speech
    }
    return await dictationTranscriber(for: requestedLocale)
  }

  private func speechTranscriber(for requestedLocale: Locale) async -> SelectedTranscriber? {
    guard SpeechTranscriber.isAvailable,
          let locale = await SpeechTranscriber.supportedLocale(equivalentTo: requestedLocale),
          locale.identifier(.bcp47) == requestedLocale.identifier(.bcp47) else {
      return nil
    }

    let transcriber = SpeechTranscriber(
      locale: locale,
      transcriptionOptions: [],
      reportingOptions: [.volatileResults],
      attributeOptions: [.audioTimeRange]
    )
    let status = await AssetInventory.status(forModules: [transcriber])
    guard Self.isUsable(status) else { return nil }
    return .speech(transcriber, status)
  }

  private func dictationTranscriber(for requestedLocale: Locale) async -> SelectedTranscriber? {
    guard let locale = await DictationTranscriber.supportedLocale(equivalentTo: requestedLocale),
          locale.identifier(.bcp47) == requestedLocale.identifier(.bcp47) else {
      return nil
    }

    let transcriber = DictationTranscriber(
      locale: locale,
      contentHints: [],
      transcriptionOptions: [],
      reportingOptions: [.volatileResults, .frequentFinalization],
      attributeOptions: [.audioTimeRange]
    )
    let status = await AssetInventory.status(forModules: [transcriber])
    guard Self.isUsable(status) else { return nil }
    return .dictation(transcriber, status)
  }

  private static func isUsable(_ status: AssetInventory.Status) -> Bool {
    switch status {
    case .installed, .supported, .downloading:
      return true
    case .unsupported:
      return false
    @unknown default:
      return false
    }
  }

  private static func portStatus(for status: AssetInventory.Status) -> String {
    switch status {
    case .installed:
      return "installed"
    case .supported:
      return "supported"
    case .downloading:
      return "downloading"
    case .unsupported:
      return "unsupported"
    @unknown default:
      return "unsupported"
    }
  }

  private func startResultConsumer(for selected: SelectedTranscriber) {
    switch selected {
    case .speech(let transcriber, _):
      resultTask = Task { @MainActor [weak self] in
        do {
          for try await result in transcriber.results {
            self?.receiveResult(
              text: String(result.text.characters),
              range: result.range,
              finalizationTime: result.resultsFinalizationTime,
              isFinal: result.isFinal
            )
          }
        } catch {
          self?.reportResultFailure(error)
        }
      }
    case .dictation(let transcriber, _):
      resultTask = Task { @MainActor [weak self] in
        do {
          for try await result in transcriber.results {
            self?.receiveResult(
              text: String(result.text.characters),
              range: result.range,
              finalizationTime: result.resultsFinalizationTime,
              isFinal: result.isFinal
            )
          }
        } catch {
          self?.reportResultFailure(error)
        }
      }
    }
  }

  private func startCapture() throws {
    guard let inputBuilder, let analyzerFormat else {
      throw ListenEngineFailure.analyzerNotPrepared
    }
    listenMode = true
    try Self.setListenModeCategory(true)
    observeInterruptionNotifications()

    let engine = audioEngine ?? AVAudioEngine()
    if configurationChangeObserver == nil {
      configurationChangeObserver = NotificationCenter.default.addObserver(
        forName: .AVAudioEngineConfigurationChange,
        object: engine,
        queue: .main
      ) { [weak self] _ in
        Task { @MainActor [weak self] in
          // Leaving Listen mode changes the category too, and restarting then would switch it back.
          guard let self, self.capturing, self.listenMode else { return }
          self.removeCapture()
          self.audioConverter = nil
          do {
            try self.startCapture()
          } catch {
            self.reportFailure(String(describing: error))
          }
        }
      }
    }
    let input = engine.inputNode
    let microphoneFormat = input.outputFormat(forBus: 0)
    let converter: AVAudioConverter
    if let audioConverter {
      converter = audioConverter
    } else {
      guard let nextConverter = AVAudioConverter(from: microphoneFormat, to: analyzerFormat) else {
        throw ListenEngineFailure.noAudioConverter
      }
      converter = nextConverter
    }
    let timeline = self.timeline

    input.installTap(onBus: 0, bufferSize: 4096, format: microphoneFormat) { [weak self] buffer, _ in
      let level = Self.rmsLevel(of: buffer)
      let seconds = Double(buffer.frameLength) / buffer.format.sampleRate
      do {
        let converted = try Self.convertBuffer(
          buffer,
          using: converter,
          outputFormat: analyzerFormat
        )
        timeline.advance(
          frameCount: converted.frameLength,
          sampleRate: analyzerFormat.sampleRate
        )
        inputBuilder.yield(AnalyzerInput(buffer: converted))
        Task { @MainActor [weak self] in
          self?.receiveAudioLevel(level, seconds: seconds)
        }
      } catch {
        let reason = String(describing: error)
        Task { @MainActor [weak self] in
          self?.reportFailure(reason)
        }
      }
    }

    audioEngine = engine
    inputNode = input
    audioConverter = converter
    tapInstalled = true
    engine.prepare()
    do {
      try engine.start()
      capturing = true
    } catch {
      removeCapture()
      throw error
    }
  }

  private func removeCapture() {
    if tapInstalled {
      inputNode?.removeTap(onBus: 0)
      tapInstalled = false
    }
    audioEngine?.stop()
    capturing = false
    if voiceActive {
      voiceActive = false
      onVoice(false)
    }
  }

  private func observeInterruptionNotifications() {
    guard interruptionObservers.isEmpty else { return }

    interruptionObservers.append(
      NotificationCenter.default.addObserver(
        forName: AVAudioSession.interruptionNotification,
        object: AVAudioSession.sharedInstance(),
        queue: .main
      ) { [weak self] notification in
        guard let typeValue = notification.userInfo?[AVAudioSessionInterruptionTypeKey] as? UInt,
              AVAudioSession.InterruptionType(rawValue: typeValue) == .began else {
          return
        }
        Task { @MainActor [weak self] in
          try? await self?.pause(reason: "audio session interruption began")
        }
      }
    )

    if #available(iOS 27.0, *) {
      interruptionObservers.append(
        NotificationCenter.default.addObserver(
          forName: AVAudioSession.didBecomeInactiveNotification,
          object: AVAudioSession.sharedInstance(),
          queue: .main
        ) { [weak self] _ in
          Task { @MainActor [weak self] in
            try? await self?.pause(reason: "audio session became inactive")
          }
        }
      )
    }
  }

  private func removeInterruptionObservers() {
    for observer in interruptionObservers {
      NotificationCenter.default.removeObserver(observer)
    }
    interruptionObservers.removeAll()
  }

  private func removeConfigurationChangeObserver() {
    if let configurationChangeObserver {
      NotificationCenter.default.removeObserver(configurationChangeObserver)
      self.configurationChangeObserver = nil
    }
  }

  private func receiveAudioLevel(_ level: Double, seconds: Double) {
    guard capturing else { return }
    if level >= Self.voiceRmsThreshold {
      voicedSeconds += seconds
      if !voiceActive {
        voiceActive = true
        onVoice(true)
      }
      silenceTask?.cancel()
      silenceTask = nil
      silenceWindowPending = false
    } else if voiceActive {
      voiceActive = false
      voiceEndedAt = timeline.end
      onVoice(false)
      scheduleSilenceLineEnd()
    }
  }

  private func receiveResult(
    text: String,
    range: CMTimeRange,
    finalizationTime: CMTime,
    isFinal: Bool
  ) {
    if CMTimeCompare(finalizationTime, latestResultsFinalizationTime) > 0 {
      latestResultsFinalizationTime = finalizationTime
    }

    if isFinal {
      finalizedText += Self.repaired(final: text, volatile: volatileText)
      volatileText = ""
    } else {
      volatileText = text
    }

    resumeSettledWaiters()
    let nextText = currentText()
    guard nextText != renderedText else { return }
    renderedText = nextText
    onPartial(Self.lineText(nextText))
    // Results trail the audio by a second or more, so words heard before the voice fell don't restart the window;
    // only words after it, or words from a partner too quiet to pass the speech level, do.
    let restartsWindow = !silenceWindowPending || CMTimeCompare(CMTimeRangeGetEnd(range), voiceEndedAt) > 0
    if !voiceActive, Self.hasWords(nextText), restartsWindow {
      scheduleSilenceLineEnd()
    }
  }

  private func scheduleSilenceLineEnd() {
    // The voice falling ends a line even before its words arrive, since finalizing then delivers them, unless it rose
    // too briefly to be speech: finalizing just before a line can cost the line its first words.
    guard !lineFinalizing, voicedSeconds >= Self.minimumVoiceSeconds || Self.hasWords(currentText()) else {
      return
    }
    silenceTask?.cancel()
    silenceWindowPending = true
    silenceTask = Task { @MainActor [weak self] in
      do {
        try await Task.sleep(nanoseconds: Self.silenceWindowNanoseconds)
      } catch {
        return
      }
      guard let self, !self.voiceActive, !self.lineFinalizing else { return }
      self.silenceWindowPending = false
      do {
        try await self.finishCurrentAudio(publishLine: true)
      } catch {
        self.onState("unavailable", String(describing: error))
      }
    }
  }

  private func finishCurrentAudio(publishLine: Bool) async throws {
    guard let analyzer, !lineFinalizing else { return }
    lineFinalizing = true
    defer { lineFinalizing = false }

    let endedAt = Date().timeIntervalSince1970 * 1_000
    let boundary = timeline.end
    try await finalize(analyzer, through: boundary)
    await waitForSettledResults(through: boundary)

    let line = Self.lineText(finalizedText)
    if publishLine, Self.hasWords(line) {
      onLine(line, endedAt, Self.silenceWindowMs)
    }

    if !voiceActive { voicedSeconds = 0 }
    finalizedText = ""
    renderedText = currentText()
    if !volatileText.isEmpty {
      onPartial(Self.lineText(renderedText))
    }
  }

  private func waitForSettledResults(through boundary: CMTime) async {
    // Finalizing delivers the settled text, whose finalization time can stay short of the boundary after a silence,
    // so only words still volatile are waited for.
    guard Self.hasWords(volatileText),
          CMTimeCompare(latestResultsFinalizationTime, boundary) < 0 else {
      return
    }

    await withCheckedContinuation { continuation in
      let id = UUID()
      var waiter = ResultWaiter(
        through: boundary,
        continuation: continuation,
        timeoutTask: nil
      )
      waiter.timeoutTask = Task { @MainActor [weak self] in
        do {
          try await Task.sleep(nanoseconds: Self.resultFinalizationTimeoutNanoseconds)
        } catch {
          return
        }
        self?.resumeResultWaiter(id)
      }
      resultWaiters[id] = waiter
    }
  }

  private func resumeSettledWaiters() {
    let settled = Array(resultWaiters.keys.filter { id in
      guard let waiter = resultWaiters[id] else { return false }
      return CMTimeCompare(latestResultsFinalizationTime, waiter.through) >= 0 || !Self.hasWords(volatileText)
    })
    for id in settled {
      resumeResultWaiter(id)
    }
  }

  private func resumeResultWaiter(_ id: UUID) {
    guard let waiter = resultWaiters.removeValue(forKey: id) else { return }
    waiter.timeoutTask?.cancel()
    waiter.continuation.resume()
  }

  private func currentText() -> String {
    finalizedText + volatileText
  }

  private func clearTranscript() {
    finalizedText = ""
    volatileText = ""
    renderedText = ""
    voicedSeconds = 0
    silenceWindowPending = false
    for id in Array(resultWaiters.keys) {
      resumeResultWaiter(id)
    }
  }

  private func reportResultFailure(_ error: Error) {
    reportFailure(String(describing: error))
  }

  private func reportFailure(_ reason: String) {
    onState("unavailable", reason)
    for id in Array(resultWaiters.keys) {
      resumeResultWaiter(id)
    }
  }

  /// The analyzer finalizes only once audio passes the boundary, and on the phone only once another buffer follows that
  /// audio, so with capture stopped the module gives it silence a quarter second at a time until it returns.
  private func finalize(_ analyzer: SpeechAnalyzer, through boundary: CMTime) async throws {
    guard !capturing else {
      try await analyzer.finalize(through: boundary)
      return
    }
    finalizeReturned = false
    let finalizing = Task { [weak self] in
      defer { self?.finalizeReturned = true }
      try await analyzer.finalize(through: boundary)
    }
    var flushed = 0.0
    while !finalizeReturned, flushed < Self.silenceFlushLimitSeconds {
      flushSilence()
      flushed += Self.silenceFlushSeconds
      try? await Task.sleep(nanoseconds: 20_000_000)
    }
    // Past the limit, the finalize returns once capture starts again.
    if finalizeReturned { try await finalizing.value }
  }

  /// Gives the analyzer silence past the audio it has, so a finalize can return once capture stops.
  private func flushSilence() {
    guard let inputBuilder, let analyzerFormat else { return }
    let frames = AVAudioFrameCount(Self.silenceFlushSeconds * analyzerFormat.sampleRate)
    guard let silence = AVAudioPCMBuffer(pcmFormat: analyzerFormat, frameCapacity: frames) else { return }
    silence.frameLength = frames
    for buffer in UnsafeMutableAudioBufferListPointer(silence.mutableAudioBufferList) {
      if let data = buffer.mData { memset(data, 0, Int(buffer.mDataByteSize)) }
    }
    timeline.advance(frameCount: frames, sampleRate: analyzerFormat.sampleRate)
    inputBuilder.yield(AnalyzerInput(buffer: silence))
  }

  /// Whether text holds a letter or a digit, so the transcriber's lone "." never makes a line.
  private static func hasWords(_ text: String) -> Bool {
    text.unicodeScalars.contains { CharacterSet.alphanumerics.contains($0) }
  }

  /// After a silence, the transcriber's final pass can turn a line's first words into punctuation (". of stuffy in here")
  /// or lose the line (",......."), though its volatile pass heard them, so the volatile words fill them back in.
  private static func repaired(final: String, volatile: String) -> String {
    let heard = words(in: volatile)
    let kept = words(in: final)
    // A final with no words lost the line, unless the volatile text is a single word's start, such as "L".
    guard !kept.isEmpty else {
      guard heard.count >= 2 else { return final }
      return volatile.first?.isWhitespace == true ? volatile : " " + volatile
    }
    guard heard.count > 1 else { return final }
    // The final lost the volatile's first words when its own pick up partway through them and match on to the end
    // of either, two words at least.
    let heardWords = heard.map { $0.lowercased() }
    let keptWords = kept.map { $0.lowercased() }
    for start in 1..<heard.count {
      let overlap = min(keptWords.count, heardWords.count - start)
      if overlap < 2 { break }
      if heardWords[start..<start + overlap].elementsEqual(keptWords[..<overlap]) {
        return " " + heard[..<start].joined(separator: " ") + " " + lineText(final)
      }
    }
    return final
  }

  private static func words(in text: String) -> [String] {
    text.split { !($0.isLetter || $0.isNumber || $0 == "'" || $0 == "\u{2019}") }.map(String.init)
  }

  /// A line without the punctuation the transcriber puts before its first word after a silence, such as ". ".
  private static func lineText(_ text: String) -> String {
    let leading = CharacterSet.punctuationCharacters.union(.whitespacesAndNewlines)
    let words = text.unicodeScalars.drop { leading.contains($0) }
    return String(String.UnicodeScalarView(words)).trimmingCharacters(in: .whitespacesAndNewlines)
  }

  private static func rmsLevel(of buffer: AVAudioPCMBuffer) -> Double {
    let frames = Int(buffer.frameLength)
    let channels = Int(buffer.format.channelCount)
    guard frames > 0, channels > 0 else { return 0 }

    var sum = 0.0
    var samples = 0
    if let channelData = buffer.floatChannelData {
      for channel in 0..<channels {
        for frame in 0..<frames {
          let sample = Double(channelData[channel][frame])
          sum += sample * sample
          samples += 1
        }
      }
    } else if let channelData = buffer.int16ChannelData {
      for channel in 0..<channels {
        for frame in 0..<frames {
          let sample = Double(channelData[channel][frame]) / Double(Int16.max)
          sum += sample * sample
          samples += 1
        }
      }
    } else if let channelData = buffer.int32ChannelData {
      for channel in 0..<channels {
        for frame in 0..<frames {
          let sample = Double(channelData[channel][frame]) / Double(Int32.max)
          sum += sample * sample
          samples += 1
        }
      }
    }
    guard samples > 0 else { return 0 }
    return sqrt(sum / Double(samples))
  }

  private static func convertBuffer(
    _ input: AVAudioPCMBuffer,
    using converter: AVAudioConverter,
    outputFormat: AVAudioFormat
  ) throws -> AVAudioPCMBuffer {
    let ratio = outputFormat.sampleRate / input.format.sampleRate
    let capacity = AVAudioFrameCount(ceil(Double(input.frameLength) * ratio)) + 64
    guard let output = AVAudioPCMBuffer(pcmFormat: outputFormat, frameCapacity: capacity) else {
      throw ListenEngineFailure.noAudioBuffer
    }

    var suppliedInput = false
    var conversionError: NSError?
    let status = converter.convert(to: output, error: &conversionError) { _, inputStatus in
      guard !suppliedInput else {
        inputStatus.pointee = .noDataNow
        return nil
      }
      suppliedInput = true
      inputStatus.pointee = .haveData
      return input
    }

    if let conversionError { throw conversionError }
    guard status != .error, output.frameLength > 0 else {
      throw ListenEngineFailure.audioConversionFailed
    }
    return output
  }
}

private enum ListenEngineFailure: Error {
  case microphoneDenied
  case transcriberUnavailable
  case modelUnsupported
  case assetRequestUnavailable
  case modelNotInstalled
  case noAudioFormat
  case noAudioConverter
  case noAudioBuffer
  case audioConversionFailed
  case analyzerNotPrepared
}
