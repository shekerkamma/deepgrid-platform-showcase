/**
 * Every money figure that exists ONLY on an OCR'd page.
 *
 * WHY THIS EXISTS
 * build-knowledge-index.mjs still carries the note that the memorandum's 27
 * image-only pages are "deliberately NOT OCR-indexed", because OCR renders the
 * rupee glyph as a digit -- it cites Rs 90 Cr arriving as "390 Cr" and
 * Rs 1,388 Cr as "21,388 Cr". The loop underneath it indexes them anyway. The
 * comment describes a safety decision the code no longer implements, and a
 * wrong number in an investor dossier is worse than a missing one.
 *
 * The check is corroboration, not plausibility: a figure that also appears in
 * a non-OCR source has a second witness and is fine. One that appears only on
 * an OCR page is unverifiable by construction, and this prints it with enough
 * context for a human to adjudicate against the PDF.
 *
 * Known live example: "1,338 Cr" on page 22, where that page's own table ends
 * 731.5 -> 1388.0 and the clean executive summary says the charts total
 * Rs 1,388 Cr. Off by Rs 50 Cr, contradicted by its own page.
 *
 *   node scripts/check-ocr-figures.mjs [--strict]
 *
 * --strict exits 1 when any uncorroborated figure is found, for CI. Default
 * exits 0 and reports, because the existing 14 are a decision for the deck
 * owner rather than a build break.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const idx = JSON.parse(fs.readFileSync(path.join(root, 'src/a2ui/generated/knowledge-index.json'), 'utf8'));

const isOcr = (u) => /·\s*OCR\s*$/.test(u.source || '');
/* No \b after Cr. OCR fuses the unit into the next word -- the figure that
 * motivated this whole check reads "1,338 Crrevenue" -- so a word boundary
 * makes the check miss exactly the corrupted cases it exists to find. It
 * reported 0 money findings on page 22 for that reason. */
const MONEY = /([₹]?\s?\d[\d,]*(?:\.\d+)?)\s*(Cr|crore|lakh|%)/g;
// normalise so "1230" and "1,230" are the same witness, and a leading rupee
// glyph does not make an otherwise identical figure look distinct
const norm = (s) => s.replace(/[₹,\s]/g, '');

const clean = new Set();
for (const u of idx.units) {
  if (isOcr(u)) continue;
  for (const m of u.body.matchAll(MONEY)) clean.add(norm(m[1]));
}

const found = [];
for (const u of idx.units) {
  if (!isOcr(u)) continue;
  const text = u.body;   // title is lines[0], already inside body
  for (const m of text.matchAll(MONEY)) {
    if (clean.has(norm(m[1]))) continue;
    const at = m.index ?? 0;
    found.push({
      figure: `${m[1].trim()} ${m[2]}`,
      page: (u.source.match(/page (\d+)/) || [, '?'])[1],
      context: text.slice(Math.max(0, at - 55), at + 55).replace(/\s+/g, ' '),
    });
  }
}

// A CJK glyph on an OCR page is a substituted symbol, never real content:
// 天 for the rupee sign, 一 for an em dash, 海/物 for the D of DEEPGRID.
const glyphs = [];
for (const u of idx.units) {
  if (!isOcr(u)) continue;
  for (const m of u.body.matchAll(/[一-鿿]/g)) {
    const at = m.index ?? 0;
    glyphs.push({ ch: m[0], page: (u.source.match(/page (\d+)/) || [, '?'])[1],
      context: u.body.slice(Math.max(0, at - 26), at + 26).replace(/\s+/g, ' ') });
  }
}

console.log(`OCR pages indexed: ${idx.units.filter(isOcr).length} of ${idx.units.length} units\n`);
const money = found.filter((f) => !f.figure.endsWith('%'));
const pct = found.filter((f) => f.figure.endsWith('%'));
console.log(`UNCORROBORATED MONEY (on an OCR page, on no clean source): ${money.length}`);
for (const f of money) console.log(`  p${f.page.padStart(2)}  ${f.figure.padEnd(12)} …${f.context}…`);
console.log(`\nUNCORROBORATED PERCENTAGES: ${pct.length}  (lower risk -- the rupee glyph is what OCR turns into a digit)`);
for (const f of pct) console.log(`  p${f.page.padStart(2)}  ${f.figure.padEnd(12)} …${f.context.slice(0, 78)}…`);
console.log(`\nSUBSTITUTED GLYPHS: ${glyphs.length}`);
for (const g of glyphs) console.log(`  p${g.page.padStart(2)}  ${g.ch}  …${g.context}…`);

if (process.argv.includes('--strict') && money.length) process.exit(1);
