// Storyboards for the Technology page: app/data/storyboards.json.
//
// A film on the page is not a bare player: it comes with its story told in beats, each a frame from the film, the
// moment it starts, a short title and one or two sentences an executive can read without pressing play. Clicking a
// beat plays the film from that moment. A figure comes with what it shows and why it matters.
//
// Beats are written only from the film's own narration (public/media/captions/<film>.vtt, reviewed against the film's
// frames), and a beat can start only on a caption cue, so the frame and the words line up with what is heard. Gates
// from lib/brief-kit.mjs: every figure appears in the narration; no maturity claim the narration does not make; no
// talk of slides or narration. Figure notes are written from what a vision model read off the image
// (knowledge/image-descriptions.json) and the chapter's own sources, under the same gates.
//
//   node scripts/build-storyboards.mjs --films <dir holding <film>.mp4> [--force]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {MODEL, llm, write, unsupported, overclaims, presentationTalk, noDash} from './lib/brief-kit.mjs';
const VISION = process.env.VISION_MODEL || 'gemini-3.8-flash-high';
// "not yet validated" is the honest statement, not a maturity claim: negated forms are not checked as claims
const affirmed = s => s.replace(/\b(not|never|yet to be|before (?:it is|being)|until)\s+(?:yet\s+)?(?:been\s+|be\s+)?(validated|qualified|certified|proven)\b/gi, '');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
const FORCE = process.argv.includes('--force');
const FILMS = process.argv.includes('--films') ? process.argv[process.argv.indexOf('--films') + 1] : null;
const OUT = path.join(ROOT, 'app/data/storyboards.json');
const previous = fs.existsSync(OUT) ? read('app/data/storyboards.json') : {films: {}, figures: {}};
const FRAMES = path.join(ROOT, 'public/media/storyboard');
fs.mkdirSync(FRAMES, {recursive: true});

// the films and figures the Technology page shows, with the chapter each serves
// every film on the site; product films carry no Silicon platform chapter
const FILM_IDS = {computebox: 'sensors', roadmap: 'measured', problem: 'data', landscape: 'data', cube: 'cube', mesh: 'horizon',
  truck: null, ddrive: null, forklift: null, yard: null, sentinel: null};
const FIGURES = {'figure-05': 'domains', 'figure-07': 'sensors', 'figure-06': 'cube', 'figure-11': 'horizon'};

// The part of a frame that shows what a sentence describes, as fractions of the frame, widened to stay legible.
async function region(jpeg, sentence) {
  const raw = await llm([{role: 'user', content: [
    {type: 'text', text: `This is a frame from an animated explainer film about a chip. At this moment the story says: "${sentence}"\n` +
      'Return JSON only: {"title_card": true if the frame is a cover or title card rather than the explainer itself (or blank), ' +
      '"box": [x, y, w, h]} where box is the region of the frame, as fractions from 0 to 1 of width and height from the top ' +
      'left, that best shows what the sentence describes, including its labels. Make it at least 0.4 wide and roughly 16:10.'},
    {type: 'image_url', image_url: {url: 'data:image/jpeg;base64,' + jpeg.toString('base64')}}]}], 400, VISION).catch(() => null);
  try {
    const v = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
    if (v.title_card) return v;
    let [x, y, w, h] = v.box.map(Number);
    if (![x, y, w, h].every(Number.isFinite)) return null;
    // widen to at least 40% and to a 16:10 shape on a 16:9 frame (h = w * 16/9 * 10/16 = w * 10/9), inside the frame
    w = Math.max(w, 0.4, h * 0.9); h = Math.min(1, w * 10 / 9); w = Math.min(1, h * 0.9);
    const cx = x + v.box[2] / 2, cy = y + v.box[3] / 2;
    x = Math.min(Math.max(0, cx - w / 2), 1 - w); y = Math.min(Math.max(0, cy - h / 2), 1 - h);
    return {title_card: false, box: [x, y, w, h].map(n => Math.round(n * 1000) / 1000)};
  } catch { return null; }
}

// words that widen a claim, allowed only where the film's narration uses them itself
const WIDER = [/\bevery (?:weather|condition|angle|blind spot|quarter|object|situation)s?\b/i, /\bany (?:weather|condition)s?\b/i,
  /\ball (?:weather|conditions|angles)\b/i, /not a simulation/i, /\breal (?:floor|site|footage|warehouse|road|terminal)\b/i,
  /\blive (?:warehouse|site|operation|terminal)\b/i, /\b(?:already )?proven\b/i, /\bguarantee[sd]?\b/i];

// beat titles in sentence case; names and acronyms keep their capitals
const KEEP = new Set(['SoC', 'Orin', 'NVIDIA', 'Tesla', 'Hailo', 'Dojo', 'AD2', 'LiDAR', 'FPGA', 'TOPS', 'DMA', 'PULP', 'FlooNoC', 'Spatz',
  'ITA', 'IDMA', 'TSMC', 'PS-16', 'PS18', 'Artix-7', 'D-Drive', 'Mobileye', 'EyeQ', 'GMSL2', 'RGB', 'L2', 'SRAM', 'DRAM', 'CUDA', 'AI', 'K', 'k', 'DeepGrid']);
const sentenceCase = t => t.split(' ').map((w, i) => { const c = w.replace(/[^A-Za-z0-9-]/g, ''); return i === 0 || KEEP.has(c) || /\d/.test(c) || c === c.toUpperCase() ? w : w.toLowerCase(); }).join(' ');

function cues(film) {
  const out = [];
  for (const block of fs.readFileSync(path.join(ROOT, `public/media/captions/${film}.vtt`), 'utf8').split(/\n\s*\n/)) {
    const lines = block.trim().split('\n');
    const i = lines.findIndex(l => l.includes('-->'));
    if (i < 0) continue;
    const [a, b] = lines[i].split('-->').map(x => x.trim().split(':').reduce((s, v) => s * 60 + parseFloat(v), 0));
    out.push({start: Math.round(a * 10) / 10, end: b, text: lines.slice(i + 1).join(' ')});
  }
  return out;
}
const duration = film => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(FILMS, film + '.mp4')]).toString());

const BEAT_SYSTEM = `You storyboard a short narrated film for DeepGrid Semi's investor website. The reader is a business executive or
investor who may never press play. Split the film into 4 to 6 beats that follow it in order. Each beat starts at one of
the caption start times given (copy the number exactly) and says, in plain words, what the viewer sees at that point and
why it matters. Use ONLY the narration given. Return JSON only:

{"beats": [{"t": <a caption start time>, "title": "at most 6 words", "text": "one or two sentences"}]}

Rules:
- The first beat starts at the first caption. Beats in time order, spread across the whole film.
- Copy figures exactly as the narration gives them; never add, round or derive numbers.
- The chip is not yet fabricated in 28 nm: describe animations and simulations as such, never as measured silicon.
  SoC2 performance figures (TOPS, frame times, headroom) are design targets: say so.
- Fact to hold to even where the film words it loosely: the five steps already done are the SoC 1.x generations
  (SoC 1.0 to 1.4), and all of them run on an FPGA. No DeepGrid chip has been fabricated. Call them "on an FPGA" or
  "shipped on FPGA", never silicon, fabricated or chips.
- Every film is an animation or a simulator run: never call it real footage, a real site, live operation or "not a
  simulation". Never widen a claim past the narration: no "every", "any weather", "all conditions" or "proven" unless
  the narration says it.
- Plain, confident, no hype words, no em dashes, no mention of narration, captions, slides or decks.`;

const FIGURE_SYSTEM = `You write the caption for one figure on DeepGrid Semi's investor website, for a business executive or
investor. Use ONLY the source material given. Return JSON only:

{"title": "at most 8 words, what the figure is", "shows": "one or two sentences: what the reader is looking at",
 "matters": "one or two sentences: why it matters to the business"}

Rules: copy figures exactly as the sources give them; leave out NRE and tapeout cost (the memorandum and the financial
model disagree on them); say "rendering" or "conceptual" where the sources do; the chip is
not yet fabricated in 28 nm; no hype words, no em dashes, no mention of slides, decks, narration or passages.`;

const VERSION = crypto.createHash('sha256').update(BEAT_SYSTEM + FIGURE_SYSTEM + MODEL).digest('hex').slice(0, 12);
const story = read('app/data/tech-story.json');
const deck = read('knowledge/deck-slides.json'), notes = read('app/slide-notes.json');
const chunks = new Map(read('app/data/graphrag-unified-index.json').chunks.map(c => [c.id, c]));
const described = read('knowledge/image-descriptions.json');
const out = {films: {}, figures: {}};
const save = () => fs.writeFileSync(OUT, noDash(JSON.stringify(out, null, 1)) + '\n');

for (const [film, chapter] of Object.entries(FILM_IDS)) {
  const list = cues(film);
  const narration = list.map(c => c.text).join(' ');
  const hash = crypto.createHash('sha256').update(VERSION + JSON.stringify(list)).digest('hex').slice(0, 16);
  const prev = previous.films[film];
  if (prev && !FORCE && prev.hash === hash) { out.films[film] = prev; console.error(`= ${film} (unchanged)`); continue; }
  if (!FILMS) throw new Error(`${film} needs new frames: pass --films <dir>`);
  const starts = new Set(list.map(c => c.start));
  const check = t => {
    const bad = [];
    const beats = t?.beats || [];
    beats.forEach((b, i) => {
      if (!starts.has(Number(b.t))) bad.push(`beat ${i + 1} starts at ${b.t}, which is not a caption start time`);
      if (i && Number(b.t) <= Number(beats[i - 1].t)) bad.push(`beat ${i + 1} is out of order`);
      const s = `${b.title} ${b.text}`;
      for (const f of unsupported(s, narration + ' 28 nm')) bad.push(`figure ${f} is not in the narration`);
      for (const w of overclaims(affirmed(s), narration)) bad.push(`"${w}" is not a claim the narration makes`);
      const talk = presentationTalk(s);
      if (talk) bad.push(`talks about "${talk}"`);
      for (const re of WIDER) { const m = s.match(re); if (m && !re.test(narration)) bad.push(`"${m[0]}" widens the claim past the narration`); }
      if (/already (in )?silicon|are silicon\b|reach(?:ing|ed)? (?:fabricated )?silicon|(?<!not |not yet |never |yet to be |has not been |not been )fabricated/i.test(s)) bad.push('calls FPGA work silicon or fabricated; the SoC 1.x steps run on an FPGA and no chip is fabricated');
    });
    if (beats[0] && Number(beats[0].t) !== list[0].start) bad.push('the first beat must start at the first caption');
    return bad;
  };
  const done = t => t?.beats?.length >= 4 && t.beats.length <= 6 && check(t).length === 0;
  const {t, dropped} = await write([{role: 'system', content: BEAT_SYSTEM}, {role: 'user', content:
    `Film: ${film}\n\nCaptions (start time in seconds, then text):\n` + list.map(c => `[${c.start}] ${c.text}`).join('\n')}], check, done);
  if (!t) throw new Error(`${film}: no storyboard passed the gates: ${dropped.slice(0, 3).join(' | ')}`);
  // Each beat's frame comes from inside the beat, cropped to the part of the screen the beat talks about: these films
  // are animations on one fixed layout, so six full frames read as six copies of the same picture. A vision model
  // names the region; a frame it calls a title card (the films open on a cover card) is replaced by a later one.
  const end = duration(film);
  const beats = [];
  for (const [i, b] of t.beats.entries()) {
    const from = Number(b.t), to = i + 1 < t.beats.length ? Number(t.beats[i + 1].t) : end;
    let pick = null;
    // inside the beat first; a beat that sits wholly on the cover card takes the first real frame after it
    const times = [0.6, 0.85, 0.35].map(f => from + (to - from) * f).concat([to + 1, to + 3, to + 6]);
    for (const time of times) {
      const at = Math.min(time, end - 0.5);
      const jpeg = execFileSync('ffmpeg', ['-v', 'error', '-ss', at.toFixed(2), '-i', path.join(FILMS, film + '.mp4'), '-frames:v', '1',
        '-vf', 'crop=iw-18:ih:0:0,scale=1280:-2', '-f', 'image2', '-c:v', 'mjpeg', '-q:v', '4', 'pipe:1'], {maxBuffer: 1 << 26});
      const v = await region(jpeg, b.text);
      if (v && !v.title_card) { pick = {at, box: v.box}; break; }
    }
    if (!pick) throw new Error(`${film} beat ${i + 1}: every candidate frame is a title card`);
    const [x, y, w, h] = pick.box;
    const file = `media/storyboard/${film}-${String(Math.round(from * 10)).padStart(4, '0')}.webp`;
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', pick.at.toFixed(2), '-i', path.join(FILMS, film + '.mp4'), '-frames:v', '1',
      '-vf', `crop=iw-18:ih:0:0,crop=iw*${w}:ih*${h}:iw*${x}:ih*${y},scale=800:-2`, '-c:v', 'libwebp', '-quality', '78', path.join(ROOT, 'public', file)]);
    const [fw, fh] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path.join(ROOT, 'public', file)]).toString().trim().split(',').map(Number);
    beats.push({t: from, title: sentenceCase(b.title), text: b.text, frame: file, size: [fw, fh], at: Math.round(pick.at * 10) / 10});
  }
  out.films[film] = {chapter, beats, hash, model: MODEL};
  save();
  console.error(`+ ${film}: ${beats.length} beats`);
}

for (const [fig, chapterId] of Object.entries(FIGURES)) {
  const ch = story.chapters.find(c => c.id === chapterId);
  const desc = described[`public/images/${fig}.webp`];
  if (!desc) throw new Error(`${fig} has no vision description`);
  const source = [`WHAT THE IMAGE SHOWS (${desc.kind}): ${desc.shows}`,
    ...ch.slides.map(n => `${deck[n - 1].text}\n${deck[n - 1].notes}\n${notes[n - 1].script}`),
    ...(ch.sources || []).map(id => `${chunks.get(id)?.section} ${chunks.get(id)?.text}`)].join('\n\n');
  const hash = crypto.createHash('sha256').update(VERSION + source).digest('hex').slice(0, 16);
  const prev = previous.figures[fig];
  if (prev && !FORCE && prev.hash === hash) { out.figures[fig] = prev; console.error(`= ${fig} (unchanged)`); continue; }
  const check = t => {
    const bad = [];
    const s = `${t?.title} ${t?.shows} ${t?.matters}`;
    for (const f of unsupported(s, source + ' 28 nm')) bad.push(`figure ${f} is not in the sources`);
    for (const w of overclaims(affirmed(s), source)) bad.push(`"${w}" is not a claim the sources make`);
    if (/\bNRE\b|tapeout cost/i.test(s)) bad.push('mentions NRE, which is left out');
    const talk = presentationTalk(s);
    if (talk) bad.push(`talks about "${talk}"`);
    return bad;
  };
  const done = t => !!t?.title && !!t.shows && !!t.matters && check(t).length === 0;
  const {t, dropped} = await write([{role: 'system', content: FIGURE_SYSTEM}, {role: 'user', content: `Figure ${fig}.\n\nSources:\n\n${source}`}], check, done);
  if (!t) throw new Error(`${fig}: no caption passed the gates: ${dropped.slice(0, 3).join(' | ')}`);
  out.figures[fig] = {chapter: chapterId, kind: desc.kind, title: t.title, shows: t.shows, matters: t.matters, hash, model: MODEL};
  save();
  console.error(`+ ${fig}: ${t.title}`);
}
save();
console.error(`storyboards: ${Object.keys(out.films).length} films, ${Object.keys(out.figures).length} figures -> app/data/storyboards.json`);
