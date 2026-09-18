import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source=path.join(root,'dist/client'), output=path.join(root,'dist/pages');
const base='/deepgrid-platform-showcase/';
fs.rmSync(output,{recursive:true,force:true});
fs.cpSync(source,output,{recursive:true});
// Vite's preload map lists deps as "_next/static/..." and its URL builder prepends "/", so those need the
// base without its leading slash, or every preload for the lazy Ask DeepGrid chunk 404s beside the import.
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(/\.(html|js|rsc|json|css)$/.test(file)){let text=fs.readFileSync(file,'utf8').replaceAll('/_next/',base+'_next/');if(file.endsWith('.js'))text=text.replaceAll('"_next/static/','"'+base.slice(1)+'_next/static/');fs.writeFileSync(file,text);}}}
walk(output);
const chunks=path.join(output,'_next/static/chunks');
for(const f of fs.readdirSync(chunks).filter(f=>f.endsWith('.js')))if(fs.readFileSync(path.join(chunks,f),'utf8').includes('"_next/static/'))throw Error('Unprefixed preload dependency in '+f);
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
// Ask DeepGrid loads its knowledge graph and semantic index by literal ./knowledge/ and ./graphrag/ paths.
const appSource=['app','app/data'].flatMap(d=>fs.readdirSync(path.join(root,d)).filter(f=>/\.(tsx?|css)$/.test(f)).map(f=>fs.readFileSync(path.join(root,d,f),'utf8'))).join('\n');
const askAssets=[...new Set([...appSource.matchAll(/\.\/((?:knowledge|graphrag)\/[\w./-]+\.(?:md|json|bin|html))/g)].map(m=>m[1]))];
for(const rel of askAssets)if(!fs.existsSync(path.join(output,rel)))throw Error('Missing Ask DeepGrid asset: '+rel);
console.log(`Pages package ready: ${checked} entry references, all 104 slides and ${askAssets.length} Ask DeepGrid assets verified.`);
