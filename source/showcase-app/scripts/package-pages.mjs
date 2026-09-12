import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source=path.join(root,'dist/client'), output=path.join(root,'dist/pages');
const base='/deepgrid-platform-showcase/';
fs.rmSync(output,{recursive:true,force:true});
fs.cpSync(source,output,{recursive:true});
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(/\.(html|js|rsc|json|css)$/.test(file))fs.writeFileSync(file,fs.readFileSync(file,'utf8').replaceAll('/_next/',base+'_next/'));}}
walk(output);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
fs.writeFileSync(path.join(output,'build-info.json'),JSON.stringify({commit:process.env.GITHUB_SHA||'local',source:'source/showcase-app/',builtAt:new Date().toISOString()}));
const html=fs.readFileSync(path.join(output,'index.html'),'utf8');
let checked=0;
for(const [,ref] of html.matchAll(/(?:src|href)="([^"?#]+)"/g)){
 if(/^(https?:|data:|mailto:)/.test(ref))continue;
 const relative=ref.startsWith(base)?ref.slice(base.length):ref.replace(/^\.\//,'');
 if(ref.startsWith('/')&&!ref.startsWith(base))throw Error('Unprefixed asset: '+ref);
 if(!fs.existsSync(path.join(output,relative)))throw Error('Missing asset: '+ref);
 checked++;
}
for(let i=1;i<=104;i++)if(!fs.existsSync(path.join(output,`slides/slide_${String(i).padStart(2,'0')}.png`)))throw Error('Missing slide '+i);
console.log(`Pages package ready: ${checked} entry references and all 104 slides verified.`);
