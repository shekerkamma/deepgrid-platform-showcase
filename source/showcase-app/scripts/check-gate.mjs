// Build gate for the browser gate. scripts/verify-site.mjs is the only thing standing between a
// regression and the live site, and a check deleted from it fails silently: the run still prints
// "all checks passed", because a gate that measures less always goes green. That happened on
// 2026-09-20, when an uncommitted edit dropped the display-font check and the screenshot capture
// and added a "SKIP main checks" branch, and a local run reported a pass that meant nothing.
//
// So this fails if verify-site.mjs loses a per-route assertion, stops writing screenshots (the
// artifact the workflow uploads on failure), stops exiting non-zero, or grows a branch that logs a
// skip in place of failing. It is a static read: no browser, no build, instant.
import fs from 'node:fs';

const SRC = 'scripts/verify-site.mjs';
const src = fs.readFileSync(SRC, 'utf8');
const fails = [];

// Each per-route assertion, by the message it fails with. Losing one is losing the check.
for (const [what, needle] of [
  ['horizontal overflow', 'horizontal overflow'],
  ['broken images', 'broken images'],
  ['visible em dashes', 'visible em dash'],
  ['images without width/height', 'without width/height'],
  ['h1 count', 'h1 elements'],
  ['display font loaded', 'display font not loaded'],
  ['unrevealed reveal targets', 'reveal targets never finished'],
])
  if (!src.includes(needle)) fails.push(`${SRC} no longer fails on ${what} ("${needle}")`);

// The screenshots are the evidence when it goes red: route shots and the clocks sequence.
const shots = (src.match(/\.screenshot\(/g) || []).length;
if (shots < 2) fails.push(`${SRC} takes ${shots} screenshot(s), expected the route and clocks captures`);

// A red gate has to stop the deploy.
if (!/process\.exit\(\s*fails\.length\s*\?\s*1\s*:\s*0\s*\)/.test(src))
  fails.push(`${SRC} does not exit 1 when fails.length is non-zero`);

// A skip is not a pass. Anything that logs its way past a check belongs in a fail() instead.
const skip = src.match(/^.*\bSKIP\b.*$/gm);
if (skip) fails.push(`${SRC} logs a skip instead of failing: ${skip[0].trim()}`);

if (fails.length) {
  console.error('\nBrowser gate check FAILED:');
  for (const f of fails) console.error('  ' + f);
  console.error('\nRestore the check, or change this file in the same commit and say why.\n');
  process.exit(1);
}
console.log(`browser gate ok: 7 per-route assertions, ${shots} screenshot captures, exits 1 on failure`);
