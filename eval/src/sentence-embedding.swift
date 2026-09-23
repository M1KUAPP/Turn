// Apple's English sentence embedding for the evaluation's `apple` ranker, as Turn's phone would compute it (EVAL-8).
// `eval/src/apple.ts` runs it as `swift sentence-embedding.swift <revision>` and keeps it open for the run. It loads
// the revision its argument names and writes one JSON line naming the revision, the dimension, and the system; then it
// answers each line of standard input, a JSON array of texts, with one JSON line holding their vectors, and exits when
// standard input ends. One thread asks for every vector, since one embedding isn't safe for concurrent use.
import Foundation
import NaturalLanguage

/// Ends the helper with a message on standard error.
func fail(_ message: String) -> Never {
  FileHandle.standardError.write(Data((message + "\n").utf8))
  exit(1)
}

/// Writes one line of JSON to standard output, unbuffered, so the evaluation reads it at once.
func send(_ object: Any) {
  guard let data = try? JSONSerialization.data(withJSONObject: object) else { fail("Can't write the answer as JSON") }
  FileHandle.standardOutput.write(data + Data("\n".utf8))
}

guard CommandLine.arguments.count == 2, let revision = Int(CommandLine.arguments[1]) else {
  fail("Usage: swift sentence-embedding.swift <revision>")
}
guard let embedding = NLEmbedding.sentenceEmbedding(for: .english, revision: revision) else {
  let revisions = NLEmbedding.supportedSentenceEmbeddingRevisions(for: .english).map(String.init)
  let missing = "This Mac has no English sentence embedding at revision \(revision), only at: "
  fail(missing + revisions.joined(separator: ", "))
}
send([
  "revision": embedding.revision,
  "dimension": embedding.dimension,
  "system": ProcessInfo.processInfo.operatingSystemVersionString,
])
while let line = readLine() {
  guard let texts = try? JSONSerialization.jsonObject(with: Data(line.utf8)) as? [String] else {
    fail("Each line must be a JSON array of texts")
  }
  send(texts.map { text -> [Double] in
    guard let vector = embedding.vector(for: text) else { fail("No vector for a text of \(text.count) characters") }
    return vector
  })
}
