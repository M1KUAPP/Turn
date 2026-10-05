import AVFAudio
import ExpoModulesCore
import Foundation

public class TurnVoiceModule: Module {
  private var voicesObserver: NSObjectProtocol?

  public func definition() -> ModuleDefinition {
    Name("TurnVoice")

    AsyncFunction("requestPersonalVoice") { () async -> String in
      let status = await AVSpeechSynthesizer.requestPersonalVoiceAuthorization()
      switch status {
      case .authorized:
        return "authorized"
      case .denied:
        return "denied"
      case .notDetermined:
        return "notDetermined"
      case .unsupported:
        return "unsupported"
      @unknown default:
        return "unsupported"
      }
    }

    AsyncFunction("personalVoice") { () -> [String: String]? in
      guard
        AVSpeechSynthesizer.personalVoiceAuthorizationStatus == .authorized,
        let candidate = AVSpeechSynthesisVoice.speechVoices().first(where: {
          $0.voiceTraits.contains(.isPersonalVoice)
        }),
        let voice = AVSpeechSynthesisVoice(identifier: candidate.identifier)
      else {
        return nil
      }
      return ["identifier": voice.identifier, "name": voice.name]
    }

    Events("onVoicesChanged")

    OnStartObserving("onVoicesChanged") {
      self.voicesObserver = NotificationCenter.default.addObserver(
        forName: AVSpeechSynthesizer.availableVoicesDidChangeNotification,
        object: nil,
        queue: .main
      ) { [weak self] _ in
        self?.sendEvent("onVoicesChanged")
      }
    }

    OnStopObserving("onVoicesChanged") {
      if let observer = self.voicesObserver {
        NotificationCenter.default.removeObserver(observer)
        self.voicesObserver = nil
      }
    }
  }
}
