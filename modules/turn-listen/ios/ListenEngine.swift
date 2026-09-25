import AVFAudio
import CoreMedia
import Foundation
import Speech

@available(iOS 26.0, *)
@MainActor
final class ListenEngine {
  private static let silenceWindowMs = 500
  private static let silenceWindowNanoseconds: UInt64 = 500_000_000
  private static let voiceRmsThreshold = 0.015

  private struct Segment {
    let range: CMTimeRange
    let text: String
  }

  private struct ResultWaiter {
    let through: CMTime
    let continuation: CheckedContinuation<Void, Never>
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
  private let onPartial: (String) -> Void
  private let onLine: (String, Double, Int) -> Void
  private let onState: (String, String?) -> Void
  private let onAssetProgress: (Double?) -> Void
  private let onVoice: (Bool) -> Void

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
  private var tapInstalled = false
  private var capturing = false
  private var voiceActive = false
  private var lineFinalizing = false
  private var finalizedSegments: [Segment] = []
  private var volatileSegments: [Segment] = []
  private var renderedText = ""
  private var resultWaiters: [ResultWaiter] = []

  init(
    onPartial: @escaping (String) -> Void,
    onLine: @escaping (String, Double, Int) -> Void,
    onState: @escaping (String, String?) -> Void,
    onAssetProgress: @escaping (Double?) -> Void,
    onVoice: @escaping (Bool) -> Void
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
      let reason = String(describing: error)
      onState("unavailable", reason)
      throw error
    }
  }

  func pause() async throws {
    guard analyzer != nil, capturing else { return }
    removeCapture()
    silenceTask?.cancel()
    silenceTask = nil
    do {
      try await finishCurrentAudio(publishLine: false)
      clearTranscript()
      onState("paused", nil)
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
      audioEngine = nil
      inputNode = nil
      audioConverter = nil
      timeline.reset()
      onState("idle", nil)
    } catch {
      analyzer = nil
      selectedTranscriber = nil
      clearTranscript()
      audioEngine = nil
      inputNode = nil
      audioConverter = nil
      timeline.reset()
      onState("unavailable", String(describing: error))
      throw error
    }
  }

  func endLine() async throws {
    silenceTask?.cancel()
    silenceTask = nil
    try await finishCurrentAudio(publishLine: true)
  }

  func muteForSpeech(_ muted: Bool) throws {
    try AVAudioApplication.shared.setInputMuted(muted)
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

    let engine = audioEngine ?? AVAudioEngine()
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
          self?.receiveAudioLevel(level)
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

  private func receiveAudioLevel(_ level: Double) {
    guard capturing else { return }
    if level >= Self.voiceRmsThreshold {
      if !voiceActive {
        voiceActive = true
        onVoice(true)
      }
      silenceTask?.cancel()
      silenceTask = nil
    } else if voiceActive {
      voiceActive = false
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
    let newlyFinalized = volatileSegments.filter {
      CMTimeCompare($0.range.end, finalizationTime) <= 0
    }
    volatileSegments.removeAll {
      CMTimeCompare($0.range.end, finalizationTime) <= 0
    }
    finalizedSegments.append(contentsOf: newlyFinalized)

    finalizedSegments.removeAll { Self.sameRange($0.range, range) }
    volatileSegments.removeAll { Self.sameRange($0.range, range) }

    let segment = Segment(range: range, text: text)
    if isFinal || CMTimeCompare(finalizationTime, range.end) >= 0 {
      finalizedSegments.append(segment)
    } else {
      volatileSegments.append(segment)
    }
    finalizedSegments.sort { CMTimeCompare($0.range.start, $1.range.start) < 0 }
    volatileSegments.sort { CMTimeCompare($0.range.start, $1.range.start) < 0 }

    resumeSettledWaiters()
    let nextText = currentText()
    guard nextText != renderedText else { return }
    renderedText = nextText
    onPartial(nextText)
    if !voiceActive {
      scheduleSilenceLineEnd()
    }
  }

  private func scheduleSilenceLineEnd() {
    guard !lineFinalizing,
          !currentText().trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      return
    }
    silenceTask?.cancel()
    silenceTask = Task { @MainActor [weak self] in
      do {
        try await Task.sleep(nanoseconds: Self.silenceWindowNanoseconds)
      } catch {
        return
      }
      guard let self, !self.voiceActive, !self.lineFinalizing else { return }
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
    try await analyzer.finalize(through: boundary)
    await waitForSettledResults(through: boundary)

    let line = text(through: boundary).trimmingCharacters(in: .whitespacesAndNewlines)
    if publishLine, !line.isEmpty {
      onLine(line, endedAt, Self.silenceWindowMs)
    }

    finalizedSegments.removeAll { CMTimeCompare($0.range.end, boundary) <= 0 }
    volatileSegments.removeAll { CMTimeCompare($0.range.end, boundary) <= 0 }
    renderedText = currentText()
    if !renderedText.isEmpty {
      onPartial(renderedText)
    }
    resumeSettledWaiters()
  }

  private func waitForSettledResults(through boundary: CMTime) async {
    guard hasVolatileResults(through: boundary) else { return }
    await withCheckedContinuation { continuation in
      resultWaiters.append(ResultWaiter(through: boundary, continuation: continuation))
    }
  }

  private func hasVolatileResults(through boundary: CMTime) -> Bool {
    volatileSegments.contains { CMTimeCompare($0.range.end, boundary) <= 0 }
  }

  private func resumeSettledWaiters() {
    let settled = resultWaiters.filter { !hasVolatileResults(through: $0.through) }
    resultWaiters.removeAll { !hasVolatileResults(through: $0.through) }
    for waiter in settled {
      waiter.continuation.resume()
    }
  }

  private func currentText() -> String {
    (finalizedSegments + volatileSegments)
      .sorted { CMTimeCompare($0.range.start, $1.range.start) < 0 }
      .map(\.text)
      .joined()
  }

  private func text(through boundary: CMTime) -> String {
    (finalizedSegments + volatileSegments)
      .filter { CMTimeCompare($0.range.end, boundary) <= 0 }
      .sorted { CMTimeCompare($0.range.start, $1.range.start) < 0 }
      .map(\.text)
      .joined()
  }

  private func clearTranscript() {
    finalizedSegments.removeAll()
    volatileSegments.removeAll()
    renderedText = ""
    resumeSettledWaiters()
  }

  private func reportResultFailure(_ error: Error) {
    reportFailure(String(describing: error))
  }

  private func reportFailure(_ reason: String) {
    onState("unavailable", reason)
    for waiter in resultWaiters {
      waiter.continuation.resume()
    }
    resultWaiters.removeAll()
  }

  private static func sameRange(_ lhs: CMTimeRange, _ rhs: CMTimeRange) -> Bool {
    CMTimeCompare(lhs.start, rhs.start) == 0 && CMTimeCompare(lhs.end, rhs.end) == 0
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
