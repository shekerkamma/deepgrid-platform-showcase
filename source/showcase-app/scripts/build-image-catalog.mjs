// The images Ask DeepGrid may put beside an answer: app/data/image-catalog.json.
// Joins three files, each with one job:
//   knowledge/image-manifest.json      where an image comes from (a deck slide, a film at a second, a figure)
//   knowledge/image-descriptions.json  what it shows, read off the image by a vision model (the only caption source)
//   app/data/image-links.json          which passages, themes and products it depicts (multimodal embeddings)
// An image is included only with a description and at least one link. Files whose provenance was never recorded
// (added with the DG32 visual assets) are held back until someone says where they come from.
//   node scripts/build-image-catalog.mjs        (after describe-images.py and build-image-links.py)
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
// intrinsic size, so the page reserves the space before the image loads
const size = file => {
  if (file.endsWith('.svg')) { const m = /viewBox="[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)"/.exec(fs.readFileSync(file, 'utf8').slice(0, 4000)); return m ? [Math.round(+m[1]), Math.round(+m[2])] : [1600, 900]; }
  return execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]).toString().trim().split(',').map(Number);
};
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const manifest = read('knowledge/image-manifest.json').images;
const described = read('knowledge/image-descriptions.json');
const links = Object.fromEntries(read('app/data/image-links.json').images.map(i => [i.image, i.links]));
const films = Object.fromEntries([...fs.readFileSync('app/views/films.tsx', 'utf8').matchAll(/id: '([a-z]+)',\s*title: '([^']+)'/g)].map(m => [m[1], m[2]]));
films.master = 'The narrated portfolio walkthrough';
const clock = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
const KIND = {photograph: 'Photograph', render: 'Rendering', screenshot: 'Simulator screenshot', slide: 'Deck slide', diagram: 'Diagram', chart: 'Chart'};

const out = [], held = [];
for (const m of manifest) {
  const d = described[m.file], l = links[m.id] || [];
  if (!d || !l.length) continue;
  if (/provenance not recorded/.test(m.source)) { held.push(m.file); continue; }
  const source = m.slide
    ? {label: `Portfolio deck, slide ${m.slide}: ${m.title.split(' · ').slice(1).join(' · ') || m.title}`, hash: m.nav}
    : m.film && m.t
      ? {label: `Film: ${films[m.film] || m.film}, at ${clock(m.t)}`, hash: m.filmNav}
      : m.film
        ? {label: `Film: ${films[m.film] || m.film}`, hash: m.filmNav}
        : {label: m.source, hash: m.nav || ''};
  out.push({id: m.id, file: m.file.replace(/^public\//, ''), size: size(m.file), kind: KIND[d.kind] || d.kind, caption: d.shows,
    source, links: l.map(x => [x.target, x.score])});
}
// curated themes name their image by id (knowledge/theme-images.json); a named image must be described
const themes = {};
for (const [title, ids] of Object.entries(read('knowledge/theme-images.json').themes)) {
  const id = ids.find(i => out.some(e => e.id === i) || manifest.some(m => m.id === i && described[m.file]));
  if (!id) continue;
  if (!out.some(e => e.id === id)) {
    const m = manifest.find(x => x.id === id), d = described[m.file];
    out.push({id, file: m.file.replace(/^public\//, ''), size: size(m.file), kind: KIND[d.kind] || d.kind, caption: d.shows,
      source: m.slide ? {label: `Portfolio deck, slide ${m.slide}: ${m.title.split(' · ').slice(1).join(' · ') || m.title}`, hash: m.nav} : {label: m.source, hash: m.nav || ''}, links: []});
  }
  themes[title] = id;
}
fs.writeFileSync('app/data/image-catalog.json', JSON.stringify({images: out, themes}) + '\n');
console.log(`image catalog: ${Object.keys(themes).length} themes with an image; ${out.length} images with a description and a link; ${held.length} held back (provenance not recorded)`);
