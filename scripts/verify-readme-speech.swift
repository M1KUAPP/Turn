// Maestro's iOS tap can return after a short utterance finishes. Check the recorded frames instead.
import AVFoundation
import CoreImage
import ImageIO
import UniformTypeIdentifiers
import Vision

guard CommandLine.arguments.count == 3 else {
    fatalError("Usage: swift scripts/verify-readme-speech.swift <video.mp4> <evidence-directory>")
}
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let directory = URL(fileURLWithPath: CommandLine.arguments[2], isDirectory: true)
try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
guard let track = try await asset.loadTracks(withMediaType: .video).first else {
    fatalError("The recording has no video track")
}
let reader = try AVAssetReader(asset: asset)
let output = AVAssetReaderTrackOutput(
    track: track,
    outputSettings: [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA]
)
reader.add(output)
guard reader.startReading() else { fatalError("Cannot read recording: \(String(describing: reader.error))") }
// GitHub's virtualized Mac has no usable GPU/Neural Engine for Vision or Core Image.
let context = CIContext(options: [.useSoftwareRenderer: true])
let states = ["Repeat", "Stop", "Repeat"]
let files = ["readme-before-speech.png", "readme-speaking.png", "readme-after-speech.png"]
var state = 0
var lastTime = -1.0
var evidence: [String] = []

while let sample = output.copyNextSampleBuffer() {
    let time = CMTimeGetSeconds(CMSampleBufferGetPresentationTimeStamp(sample))
    // Decode actual samples rather than seeking: simctl recordings contain long gaps between screen changes.
    guard time - lastTime >= 0.1, let pixels = CMSampleBufferGetImageBuffer(sample) else { continue }
    lastTime = time
    let request = VNRecognizeTextRequest()
    request.usesCPUOnly = true
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-US"]
    try VNImageRequestHandler(cvPixelBuffer: pixels).perform([request])
    let words = (request.results ?? []).compactMap { result -> (String, CGRect)? in
        guard let text = result.topCandidates(1).first?.string else { return nil }
        return (text, result.boundingBox)
    }
    let text = words.map { $0.0 }.joined(separator: " ")
    // Earlier saved/typed speech must not satisfy the selected reply's evidence.
    guard text.contains("How was physio?"), text.contains("It was hard") else { continue }
    let toolbar = words.filter { $0.1.maxY < 0.2 }.map { $0.0 }
    let expected = states[state]
    let other = expected == "Stop" ? "Repeat" : "Stop"
    guard toolbar.contains(expected), !toolbar.contains(other) else { continue }
    let source = CIImage(cvPixelBuffer: pixels)
    guard let image = context.createCGImage(source, from: source.extent),
          let destination = CGImageDestinationCreateWithURL(
            directory.appendingPathComponent(files[state]) as CFURL, UTType.png.identifier as CFString, 1, nil
          ) else { fatalError("Cannot save speech evidence") }
    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else { fatalError("Cannot finish speech evidence image") }
    evidence.append(String(format: "%.3fs: %@ — %@", time, expected, files[state]))
    state += 1
    if state == states.count { break }
}

guard state == states.count else {
    fputs("Missing recorded speech transition: saw \(evidence), expected Repeat → Stop → Repeat for How was physio?\n", stderr)
    exit(1)
}
let report = evidence.joined(separator: "\n") + "\n"
try report.write(to: directory.appendingPathComponent("speech-evidence.txt"), atomically: true, encoding: .utf8)
print(report)
