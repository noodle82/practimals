import{mkdir,copyFile,cp,access}from'node:fs/promises';
import path from'node:path';import{fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),out=path.join(root,'dist');
const files=['index.html','theme.css','logo.svg','sample.js','app.css','app.js','monster.js','spelling.js','learning.js','meanings.js','voice.js','pal-interaction.js','pal-gestures.js'];
await access(path.join(root,'vendor','three.module.js'));await access(path.join(root,'vendor','three.core.js'));await mkdir(out,{recursive:true});for(const f of files)await copyFile(path.join(root,f),path.join(out,f));await cp(path.join(root,'vendor'),path.join(out,'vendor'),{recursive:true});console.log('Built spelling-only app in dist/. No website was published.');
