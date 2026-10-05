import ExpoModulesCore
import Foundation
import NaturalLanguage

public class TurnListenModule: Module {
  private let gazetteerLock = NSLock()
  private var gazetteer: NLGazetteer?
  private var nameModelReady = false

  @MainActor
  private lazy var listenEngine = ListenEngine(
    onPartial: { [weak self] text in
      self?.sendEvent("onPartial", ["text": text])
    },
    onLine: { [weak self] text, endedAt, silenceWindowMs in
      self?.sendEvent("onLine", [
        "text": text,
        "endedAt": endedAt,
        "silenceWindowMs": silenceWindowMs
      ])
    },
    onState: { [weak self] state, reason in
      var payload: [String: Any] = ["state": state]
      if let reason {
        payload["reason"] = reason
      }
      self?.sendEvent("onState", payload)
    },
    onAssetProgress: { [weak self] fraction in
      var payload: [String: Any] = [:]
      if let fraction {
        payload["fraction"] = fraction
      } else {
        payload["fraction"] = NSNull()
      }
      self?.sendEvent("onAssetProgress", payload)
    },
    onVoice: { [weak self] active in
      self?.sendEvent("onVoice", ["active": active])
    }
  )

  public func definition() -> ModuleDefinition {
    Name("TurnListen")

    Events("onPartial", "onLine", "onState", "onAssetProgress", "onVoice")

    AsyncFunction("availability") { () async -> String in
      let engine = await MainActor.run { self.listenEngine }
      return await engine.availability()
    }

    AsyncFunction("installAsset") { () async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.installAsset()
    }

    AsyncFunction("start") { () async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.start()
    }

    AsyncFunction("pause") { () async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.pause()
    }

    AsyncFunction("resume") { () async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.resume()
    }

    AsyncFunction("stop") { () async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.stop()
    }

    AsyncFunction("endLine") { () async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.endLine()
    }

    AsyncFunction("setListenMode") { (active: Bool) async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.setListenMode(active)
    }

    AsyncFunction("muteForSpeech") { (muted: Bool) async throws in
      let engine = await MainActor.run { self.listenEngine }
      try await engine.muteForSpeech(muted)
    }

    AsyncFunction("findNames") { (texts: [String]) async throws -> [[[String: Any]]] in
      try await self.requireNameModel()
      let tagger = NLTagger(tagSchemes: [.nameType])

      self.gazetteerLock.lock()
      let currentGazetteer = self.gazetteer
      self.gazetteerLock.unlock()
      if let currentGazetteer {
        tagger.setGazetteers([currentGazetteer], for: .nameType)
      }

      let options: NLTagger.Options = [.joinNames, .omitPunctuation, .omitWhitespace]
      let accepted: [NLTag] = [.personalName, .placeName, .organizationName]

      return texts.map { text in
        tagger.string = text
        // Turn listens in English; guessing the language of a line as short as "Cupertino" can pick another one.
        tagger.setLanguage(.english, range: text.startIndex..<text.endIndex)
        var spans: [[String: Any]] = []
        tagger.enumerateTags(
          in: text.startIndex..<text.endIndex,
          unit: .word,
          scheme: .nameType,
          options: options
        ) { tag, range in
          guard let tag, accepted.contains(tag) else { return true }
          let kind: String
          switch tag {
          case .personalName:
            kind = "person"
          case .placeName:
            kind = "place"
          case .organizationName:
            kind = "org"
          default:
            return true
          }
          let nsRange = NSRange(range, in: text)
          spans.append(["kind": kind, "start": nsRange.location, "end": nsRange.location + nsRange.length])
          return true
        }
        return spans
      }
    }

    AsyncFunction("setGazetteer") { (person: [String], place: [String], org: [String]) throws in
      var dictionary: [String: [String]] = [:]
      if !person.isEmpty { dictionary[NLTag.personalName.rawValue] = person }
      if !place.isEmpty { dictionary[NLTag.placeName.rawValue] = place }
      if !org.isEmpty { dictionary[NLTag.organizationName.rawValue] = org }
      let next = dictionary.isEmpty ? nil : try NLGazetteer(dictionary: dictionary, language: .english)

      self.gazetteerLock.lock()
      self.gazetteer = next
      self.gazetteerLock.unlock()
    }
  }

  /// Without Apple's English name model the tagger finds no names, and the phone may not have it yet, so the first
  /// tagging asks for it, and no line goes to the relay until it's there (#147).
  private func requireNameModel() async throws {
    gazetteerLock.lock()
    let ready = nameModelReady
    gazetteerLock.unlock()
    if ready { return }
    guard try await NLTagger.requestAssets(for: .english, tagScheme: .nameType) == .available else {
      throw NameModelUnavailable()
    }
    gazetteerLock.lock()
    nameModelReady = true
    gazetteerLock.unlock()
  }
}

private struct NameModelUnavailable: Error {}
