import ExpoModulesCore
import Foundation
import NaturalLanguage

public class TurnListenModule: Module {
  private let gazetteerLock = NSLock()
  private var gazetteer: NLGazetteer?

  public func definition() -> ModuleDefinition {
    Name("TurnListen")

    AsyncFunction("findNames") { (texts: [String]) -> [[[String: Any]]] in
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
}
