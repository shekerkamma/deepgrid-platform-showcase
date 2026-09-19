// Visible copy uses no em dash (scroll-craft hard rule, and the DG32 site's verify gate). This turns
// each one in the showcase's own data files into a comma, which reads correctly for the parenthetical
// and appositive uses these files contain. Files copied verbatim from the DG32 site are left alone.
//   node scripts/strip-em-dash.mjs [files...]
import fs from 'node:fs';
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [
      'app/products.json',
      'app/slide-notes.json',
      'app/use-cases.json',
      'app/data/showcase-themes.json',
      'app/data/showcase-catalog.json',
    ];
export const strip = (s) =>
  s
    .replace(/(^|\\n|\n)\s*—\s*/g, '$1')
    .replace(/\s*—\s*/g, ', ')
    .replace(/,\s*,/g, ',')
    .replace(/,\s*([.;:!?])/g, '$1');
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8'),
    after = strip(before);
  const n = (before.match(/—/g) || []).length;
  if (n) fs.writeFileSync(f, after);
  console.log(f, n, '->', (after.match(/—/g) || []).length);
}
