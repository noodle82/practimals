import Capacitor
import Foundation
import WebKit

class SpelloidsViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(SpelloidsSpeechPlugin())
    }

    #if DEBUG
    private var speechProbeStarted = false
    private var speechProbeTimer: Timer?
    private var speechProbeReceiver: SpeechProbeReceiver?
    private var lastSpeechProbe: [String: Any] = ["stage": "native-controller-started", "finished": false, "pass": false]

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        guard ProcessInfo.processInfo.arguments.contains("--spelloids-speech-self-test"), !speechProbeStarted else { return }
        speechProbeStarted = true
        let receiver = SpeechProbeReceiver { [weak self] json in self?.receiveSpeechProbe(json) }
        speechProbeReceiver = receiver
        webView?.configuration.userContentController.add(receiver, name: "spelloidsSpeechProbe")
        writeSpeechProbe()
        speechProbeTimer = Timer.scheduledTimer(withTimeInterval: 300, repeats: false) { [weak self] _ in
            guard let self else { return }
            self.lastSpeechProbe["error"] = "Native speech diagnostic timed out at " + (self.lastSpeechProbe["stage"] as? String ?? "unknown stage")
            self.lastSpeechProbe["finished"] = true
            self.lastSpeechProbe["pass"] = false
            self.writeSpeechProbe()
        }
        guard let base = bridge?.config.serverURL else {
            lastSpeechProbe["error"] = "The native controller has no Capacitor server URL"
            lastSpeechProbe["finished"] = true; writeSpeechProbe(); speechProbeTimer?.invalidate(); return
        }
        let target = base.appendingPathComponent("speech-diagnostic.html")
        lastSpeechProbe["diagnosticURL"] = target.absoluteString
        lastSpeechProbe["nativePluginRegistered"] = bridge?.plugin(withName: "SpelloidsSpeech") != nil
        writeSpeechProbe()
        webView?.load(URLRequest(url: target))
    }
    private func receiveSpeechProbe(_ json: String) {
        guard let data = json.data(using: .utf8), let report = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return }
        let nativeRegistered = lastSpeechProbe["nativePluginRegistered"]
        let diagnosticURL = lastSpeechProbe["diagnosticURL"]
        lastSpeechProbe = report
        lastSpeechProbe["nativePluginRegistered"] = nativeRegistered
        lastSpeechProbe["diagnosticURL"] = diagnosticURL
        writeSpeechProbe()
        if report["finished"] as? Bool == true { speechProbeTimer?.invalidate() }
    }
    private func writeSpeechProbe() {
        guard let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first,
              let data = try? JSONSerialization.data(withJSONObject: lastSpeechProbe, options: [.prettyPrinted, .sortedKeys]) else { return }
        try? data.write(to: directory.appendingPathComponent("spelloids-speech-self-test.json"), options: .atomic)
        NSLog("Spelloids speech probe: %@", String(data: data, encoding: .utf8) ?? "")
    }
    #endif
}

#if DEBUG
private final class SpeechProbeReceiver: NSObject, WKScriptMessageHandler {
    private let receive: (String) -> Void
    init(receive: @escaping (String) -> Void) { self.receive = receive; super.init() }
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let json = message.body as? String else { return }
        receive(json)
    }
}
#endif
