import Capacitor
import Foundation

class SpelloidsViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(SpelloidsSpeechPlugin())
    }

    #if DEBUG
    private var speechProbeStarted = false
    private var speechProbeTimer: Timer?
    private var speechProbeTicks = 0
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        guard ProcessInfo.processInfo.arguments.contains("--spelloids-speech-self-test"), !speechProbeStarted else { return }
        speechProbeStarted = true
        speechProbeTimer = Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { [weak self] _ in self?.checkSpeechProbe() }
    }
    private func writeSpeechProbe(_ json: String) {
        guard let directory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else { return }
        try? Data(json.utf8).write(to: directory.appendingPathComponent("spelloids-speech-self-test.json"), options: .atomic)
    }
    private func checkSpeechProbe() {
        speechProbeTicks += 1
        if speechProbeTicks > 300 {
            speechProbeTimer?.invalidate()
            writeSpeechProbe("{\"pass\":false,\"error\":\"Native speech self-test timed out\"}")
            return
        }
        webView?.evaluateJavaScript("JSON.stringify(window.__spelloidsSpeechProbe || null)") { [weak self] value, error in
            guard let self else { return }
            if let json = value as? String, json != "null", json.contains("\"finished\":true") {
                self.speechProbeTimer?.invalidate(); self.writeSpeechProbe(json); return
            }
            guard self.speechProbeTicks < 25 else { return }
            self.webView?.evaluateJavaScript("location.protocol === 'capacitor:' && document.readyState === 'complete' && !window.__spelloidsSpeechProbe") { value, _ in
                if let ready = value as? Bool, ready { self.webView?.evaluateJavaScript(self.speechProbeScript, completionHandler: nil) }
            }
        }
    }
    private var speechProbeScript: String {
        """
        void (async()=>{
          window.__spelloidsSpeechProbe={finished:false,pass:false,clips:[],started:Date.now()};
          const report=window.__spelloidsSpeechProbe;
          try {
            const plugin=window.Capacitor?.Plugins?.SpelloidsSpeech;
            report.registered=!!plugin&&['prepare','synthesise','release'].every(k=>typeof plugin[k]==='function');
            if(!report.registered)throw Error('Speech plugin not registered in the running app');
            const {AlienSpeaker}=await import(new URL('./character-audio.js',location.href).href);
            const {speechRequest}=await import(new URL('./voice-profiles.js',location.href).href);
            const {hasSpeech}=await import(new URL('./speech-store.js',location.href).href);
            const speaker=new AlienSpeaker();
            const entries=[
              {word:'physician',meaning:'A doctor who helps people who are ill.',sentence:'The physician helped the child feel better.'},
              {word:'interruption',meaning:'Something that stops you doing something for a short time.',sentence:'We finished our story without an interruption.'}
            ];
            for(const entry of entries){
              const start=Date.now();
              await speaker.prepareMissingWord(entry,'bubbles');
              const rows=await speaker.inspectWordList([entry],'bubbles');
              if(rows[0].ready!==4)throw Error('Incomplete saved audio for '+entry.word);
              const request=speechRequest(entry.word,'bubbles');
              if(!await hasSpeech('kokoro-1939ad2-q8:'+request.voice+':'+request.text))throw Error('Word audio not saved');
              speaker.cachedOnly=true;
              const audio=await speaker.raw(entry.word,'bubbles',true,speaker.epoch);
              if(!audio.samples?.some(v=>Math.abs(v)>.0001))throw Error('Saved word audio is silent');
              speaker.cachedOnly=false;
              report.clips.push({word:entry.word,parts:rows[0].ready,ms:Date.now()-start,samples:audio.samples.length});
            }
            speaker.resetWorker();report.pass=true;
          }catch(error){report.error=error.message;}
          report.finished=true;report.elapsedMs=Date.now()-report.started;
        })();
        """
    }
    #endif
}
