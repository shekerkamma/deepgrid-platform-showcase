// Build gate for the storyboards (app/data/storyboards.json, from scripts/build-storyboards.mjs or edited by hand).
// Applies the generator's rules to what is saved, so an edit cannot slip past them: each film has 4 to 6 beats in
// order, each starting on a caption cue with its frame on disk; every figure in a beat is in the film's narration; no
// maturity claim or widened claim the narration does not make; FPGA work is never called silicon; no talk of slides
// or narration; no em dash. Figure notes: every figure appears in the image's description or its chapter's sources.
// Films are simulator runs and animations, so "real floor", "real footage", "live warehouse" and "not a simulation"
// fail even where a film's own narration says them (the forklift film does).
import fs from 'node:fs';
import {nums, supported} from './lib/figures.mjs';
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const {films, figures} = read('app/data/storyboards.json');
const CLAIMS = [/silicon[- ]proven/i, /field[- ]proven/i, /\bvalidated\b/i, /\bcertified\b/i, /\bqualified\b/i, /in production\b/i];
const WIDER = [/\bevery (?:weather|condition|angle|blind spot|quarter|object|situation)s?\b/i, /\bany (?:weather|condition)s?\b/i,
  /\ball (?:weather|conditions|angles)\b/i, /\b(?:already )?proven\b/i, /\bguarantee[sd]?\b/i];
const NEVER = [/not a simulation/i, /\breal (?:warehouse )?floor\b/i, /\breal footage\b/i, /\blive (?:warehouse|site|operation|terminal)\b/i];
const affirmed = s => s.replace(/\b(not|never|yet to be|before (?:it is|being)|until)\s+(?:yet\s+)?(?:been\s+|be\s+)?(validated|qualified|certified|proven)\b/gi, '');
const cues = film => fs.readFileSync(`public/media/captions/${film}.vtt`, 'utf8').split(/\n\s*\n/).map(b => b.trim().split('\n'))
  .filter(l => l.some(x => x.includes('-->'))).map(l => { const i = l.findIndex(x => x.includes('-->')); return {start: Math.round(l[i].split('-->')[0].trim().split(':').reduce((s, v) => s * 60 + parseFloat(v), 0) * 10) / 10, text: l.slice(i + 1).join(' ')}; });
const fails = [];
let beatsN = 0;
for (const [film, v] of Object.entries(films)) {
  const c = cues(film), narration = c.map(x => x.text).join(' '), starts = new Set(c.map(x => x.start));
  if (v.beats.length < 4 || v.beats.length > 6) fails.push(`${film}: ${v.beats.length} beats`);
  v.beats.forEach((b, i) => {
    beatsN++;
    const s = `${b.title} ${b.text}`, at = `${film} ${b.t}`;
    if (!starts.has(b.t)) fails.push(`${at}: not a caption start`);
    if (i && b.t <= v.beats[i - 1].t) fails.push(`${at}: out of order`);
    if (!fs.existsSync('public/' + b.frame)) fails.push(`${at}: frame ${b.frame} missing`);
    for (const f of nums(s).filter(f => !supported(f, narration + ' 28 nm'))) fails.push(`${at}: figure ${f} not in the narration`);
    for (const re of CLAIMS) if (re.test(affirmed(s)) && !re.test(narration)) fails.push(`${at}: "${s.match(re)[0]}" is not a claim the narration makes`);
    for (const re of WIDER) if (re.test(affirmed(s)) && !re.test(narration)) fails.push(`${at}: "${s.match(re)[0]}" widens the claim`);
    for (const re of NEVER) if (re.test(s)) fails.push(`${at}: "${s.match(re)[0]}": the films are simulator runs and animations`);
    if (/already (in )?silicon|are silicon\b|(?<!not |not yet |never |yet to be |has not been |not been )fabricated/i.test(s)) fails.push(`${at}: calls FPGA work silicon or fabricated`);
    if (/\b(slides?|narration|narrator|captions?|the deck)\b/i.test(s)) fails.push(`${at}: talks about the presentation`);
    if (/—/.test(s)) fails.push(`${at}: em dash`);
  });
}
const story = read('app/data/tech-story.json').chapters, described = read('knowledge/image-descriptions.json');
const deck = read('knowledge/deck-slides.json'), notes = read('app/slide-notes.json');
const chunks = new Map(read('app/data/graphrag-unified-index.json').chunks.map(c => [c.id, c]));
for (const [fig, n] of Object.entries(figures)) {
  const ch = story.find(c => c.id === n.chapter);
  const source = [described[`public/images/${fig}.webp`]?.shows || '', ...ch.slides.map(k => `${deck[k - 1].text} ${deck[k - 1].notes} ${notes[k - 1].script}`),
    ...(ch.sources || []).map(id => `${chunks.get(id)?.section} ${chunks.get(id)?.text}`)].join(' ') + ' 28 nm';
  const s = `${n.title} ${n.shows} ${n.matters}`;
  for (const f of nums(s).filter(f => !supported(f, source))) fails.push(`${fig}: figure ${f} not in its sources`);
  if (/\bNRE\b|tapeout cost/i.test(s)) fails.push(`${fig}: mentions NRE, which is left out`);
  if (/—/.test(s)) fails.push(`${fig}: em dash`);
}
if (fails.length) { console.error(`storyboards: ${fails.length} problem(s)\n  ` + fails.slice(0, 12).join('\n  ')); process.exit(1); }
console.log(`storyboards ok: ${Object.keys(films).length} films, ${beatsN} beats, ${Object.keys(figures).length} figure notes; every figure and claim is in its source`);
