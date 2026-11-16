import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function configureNativeSpeech(projectRoot=root){
 const app=path.join(projectRoot,'ios/App/App'),project=path.join(projectRoot,'ios/App/App.xcodeproj/project.pbxproj');
 const sources=[['SpelloidsSpeechPlugin.swift','A7E110000000000000000001','A7E110000000000000000002'],['SpelloidsViewController.swift','A7E110000000000000000003','A7E110000000000000000004']];
 let text=fs.readFileSync(project,'utf8');
 for(const[name,fileId,buildId]of sources){fs.copyFileSync(path.join(projectRoot,'native',name),path.join(app,name));if(!text.includes(fileId)){
  for(const marker of['/* End PBXFileReference section */','/* End PBXBuildFile section */'])if(!text.includes(marker))throw Error('Unexpected Xcode project: '+marker);
  text=text.replace('/* End PBXFileReference section */',`\t\t${fileId} /* ${name} */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = ${name}; sourceTree = "<group>"; };\n/* End PBXFileReference section */`);
  text=text.replace('/* End PBXBuildFile section */',`\t\t${buildId} /* ${name} in Sources */ = {isa = PBXBuildFile; fileRef = ${fileId} /* ${name} */; };\n/* End PBXBuildFile section */`);
  const group=/(\w+ \/\* App \*\/ = \{\s*isa = PBXGroup;\s*children = \()/;
  if(!group.test(text))throw Error('Missing App source group');text=text.replace(group,`$1\n\t\t\t\t${fileId} /* ${name} */,`);
  const phase=/(isa = PBXSourcesBuildPhase;[\s\S]*?files = \()/;
  if(!phase.test(text))throw Error('Missing App sources phase');text=text.replace(phase,`$1\n\t\t\t\t${buildId} /* ${name} in Sources */,`);
 }}
 fs.writeFileSync(project,text);
 const podfile=path.join(projectRoot,'ios/App/Podfile');let pods=fs.readFileSync(podfile,'utf8');
 if(!pods.includes("pod 'onnxruntime-objc'")){if(!/target ['"]App['"] do/.test(pods))throw Error('Missing App CocoaPods target');pods=pods.replace(/target ['"]App['"] do/,"target 'App' do\n  pod 'onnxruntime-objc', '1.22.0'");fs.writeFileSync(podfile,pods);}
 const storyboard=path.join(app,'Base.lproj/Main.storyboard');let story=fs.readFileSync(storyboard,'utf8');
 if(!story.includes('SpelloidsViewController')){if(!story.includes('customClass="CAPBridgeViewController"'))throw Error('Missing Capacitor view controller');story=story.replace('customClass="CAPBridgeViewController" customModule="Capacitor"','customClass="SpelloidsViewController" customModule="App"');if(!story.includes('SpelloidsViewController'))throw Error('Unexpected storyboard module');fs.writeFileSync(storyboard,story);}
 return{files:sources.map(([name])=>name),runtime:'onnxruntime-objc 1.22.0'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){configureNativeSpeech();console.log('Installed native Kokoro bridge and pinned native ONNX runtime.');}
