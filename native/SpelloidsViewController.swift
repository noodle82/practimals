import Capacitor

class SpelloidsViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(SpelloidsSpeechPlugin())
    }
}
