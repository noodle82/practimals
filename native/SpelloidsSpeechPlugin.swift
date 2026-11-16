import Foundation
import Capacitor
import CryptoKit
import onnxruntime_objc

/// Runs the app's existing Kokoro model and voice vectors directly in iOS.
/// Text pronunciation, speed, PCM caching and monster tone stay in the app.
@objc(SpelloidsSpeechPlugin)
public class SpelloidsSpeechPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "SpelloidsSpeechPlugin"
    public let jsName = "SpelloidsSpeech"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "prepare", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "synthesise", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "release", returnType: CAPPluginReturnPromise)
    ]
    private let inferenceQueue = DispatchQueue(label: "uk.learnoids.spelloids.speech", qos: .userInitiated)
    private var environment: ORTEnv?
    private var session: ORTSession?

    private func fail(_ description: String) -> NSError {
        NSError(domain: "SpelloidsSpeech", code: 1, userInfo: [NSLocalizedDescriptionKey: description])
    }

    private func modelURL() throws -> URL {
        guard let web = Bundle.main.url(forResource: "public", withExtension: nil) else {
            throw fail("Bundled speech files could not be located.")
        }
        let folder = web.appendingPathComponent("vendor/speech/models/kokoro/onnx", isDirectory: true)
        let manifest = try JSONSerialization.jsonObject(with: Data(contentsOf: folder.appendingPathComponent("parts.json"))) as? [String: Any]
        guard let manifest, let bytes = manifest["bytes"] as? Int,
              let digest = manifest["sha256"] as? String,
              let parts = manifest["parts"] as? [[String: Any]], !parts.isEmpty else {
            throw fail("The bundled voice model index is incomplete.")
        }
        let cache = try FileManager.default.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            .appendingPathComponent("SpelloidsNativeSpeech", isDirectory: true)
        try FileManager.default.createDirectory(at: cache, withIntermediateDirectories: true)
        let target = cache.appendingPathComponent("kokoro-\(digest).onnx")
        if let attributes = try? FileManager.default.attributesOfItem(atPath: target.path),
           (attributes[.size] as? NSNumber)?.intValue == bytes { return target }
        let temporary = cache.appendingPathComponent(UUID().uuidString + ".part")
        FileManager.default.createFile(atPath: temporary.path, contents: nil)
        defer { try? FileManager.default.removeItem(at: temporary) }
        let handle = try FileHandle(forWritingTo: temporary)
        defer { try? handle.close() }
        var hash = SHA256(), written = 0
        for part in parts {
            guard let name = part["file"] as? String, !name.contains("/"), !name.contains(".."),
                  let expectedBytes = part["bytes"] as? Int else { throw fail("Invalid voice model part.") }
            let data = try Data(contentsOf: folder.appendingPathComponent(name), options: .mappedIfSafe)
            guard data.count == expectedBytes else { throw fail("A bundled voice model part is incomplete.") }
            hash.update(data: data); written += data.count
            try handle.write(contentsOf: data)
        }
        let actualHash = hash.finalize().map { String(format: "%02x", $0) }.joined()
        guard written == bytes, actualHash == digest else { throw fail("The bundled voice model did not pass its integrity check.") }
        try handle.synchronize()
        if FileManager.default.fileExists(atPath: target.path) { try FileManager.default.removeItem(at: target) }
        try FileManager.default.moveItem(at: temporary, to: target)
        return target
    }

    private func prepareSession() throws -> ORTSession {
        if let session { return session }
        let model = try modelURL()
        let env = try ORTEnv(loggingLevel: .warning)
        let options = try ORTSessionOptions()
        try options.setIntraOpNumThreads(2)
        try options.setGraphOptimizationLevel(.all)
        let created = try ORTSession(env: env, modelPath: model.path, sessionOptions: options)
        environment = env; session = created
        return created
    }

    @objc func prepare(_ call: CAPPluginCall) {
        inferenceQueue.async {
            do {
                let start = Date(); _ = try self.prepareSession()
                call.resolve(["engine": "Kokoro native ONNX", "sampleRate": 24000,
                              "ms": Int(Date().timeIntervalSince(start) * 1000)])
            } catch { call.reject(error.localizedDescription) }
        }
    }

    @objc func synthesise(_ call: CAPPluginCall) {
        guard let input = call.getArray("inputIds", Int.self), (3...512).contains(input.count),
              input.first == 0, input.last == 0, input.allSatisfy({ $0 >= 0 && $0 < 256 }),
              let style = call.getArray("style", Double.self), style.count == 256,
              style.allSatisfy({ $0.isFinite }) else {
            call.reject("Invalid input for the on-device voice."); return
        }
        inferenceQueue.async {
            do {
                let start = Date(), session = try self.prepareSession()
                let ids = input.map { Int64($0) }, vector = style.map { Float($0) }, speed: [Float] = [1]
                let idsData = ids.withUnsafeBufferPointer { NSMutableData(bytes: $0.baseAddress!, length: $0.count * MemoryLayout<Int64>.stride) }
                let styleData = vector.withUnsafeBufferPointer { NSMutableData(bytes: $0.baseAddress!, length: $0.count * MemoryLayout<Float>.stride) }
                let speedData = speed.withUnsafeBufferPointer { NSMutableData(bytes: $0.baseAddress!, length: $0.count * MemoryLayout<Float>.stride) }
                let inputs = [
                    "input_ids": try ORTValue(tensorData: idsData, elementType: .int64, shape: [1, NSNumber(value: ids.count)]),
                    "style": try ORTValue(tensorData: styleData, elementType: .float, shape: [1, 256]),
                    "speed": try ORTValue(tensorData: speedData, elementType: .float, shape: [1])
                ]
                let result = try session.run(withInputs: inputs, outputNames: ["waveform"], runOptions: nil)
                guard let waveform = result["waveform"] else { throw self.fail("The native voice returned no audio.") }
                let data = try waveform.tensorData() as Data
                guard !data.isEmpty, data.count.isMultiple(of: 4), data.count <= 3 * 1024 * 1024 else {
                    throw self.fail("The native voice returned an invalid audio buffer.")
                }
                call.resolve(["pcm": data.base64EncodedString(), "sampleRate": 24000,
                              "engine": "Kokoro native ONNX", "ms": Int(Date().timeIntervalSince(start) * 1000)])
            } catch { call.reject(error.localizedDescription) }
        }
    }

    @objc func release(_ call: CAPPluginCall) {
        inferenceQueue.async { self.session = nil; self.environment = nil; call.resolve() }
    }
}
