import { chromium } from '/home/sheke/content-ideas/node_modules/playwright/index.mjs';
import { readdirSync, existsSync } from 'node:fs';

// Capture an extracted DataMovement scene as a clip for a deck seat.
// The scene pages are interactive consoles: the Play/Pause/Reset/Speed bar and
// the scrollbar are dead UI once it is a video, and they make an embedded
// animation read as a screen recording. Hide them AFTER clicking play.
const [SRC, OUT] = [process.argv[2], process.argv[3]];
const HOLD = Number(process.argv[4] || 46000);
// Prose blocks to drop. The seat is ~1200x675 on the slide, so fitting the
// page's full essay shrinks the animation until its own labels are unreadable.
// The slide carries the words in its side panels; the seat carries the visual.
const HIDE = (process.argv[5] || '').split(',').map(s => s.trim()).filter(Boolean);

const ROOT = '/home/sheke/.cache/ms-playwright';
const EXEC = readdirSync(ROOT).filter(d => /^chromium-\d+$/.test(d))
  .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
  .map(b => `${ROOT}/${b}/chrome-linux64/chrome`).find(existsSync);
if (!EXEC) { console.error('BLOCKED: no cached chromium'); process.exit(1); }

const W = 1600, H = 900;
const browser = await chromium.launch({ executablePath: EXEC, headless: false,
  args: [`--window-size=${W},${H}`, '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
const ctx = await browser.newContext({ viewport: { width: W, height: H },
  recordVideo: { dir: OUT, size: { width: W, height: H } } });
const page = await ctx.newPage();
await page.goto('file://' + SRC, { waitUntil: 'load' });
await page.waitForTimeout(2000);

// Start it first -- hiding the bar before clicking would remove the button.
const started = await page.evaluate(() => {
  const b = document.querySelector('#btnPlay'); if (!b) return false; b.click(); return true;
});
console.log('play clicked:', started);
await page.waitForTimeout(600);
await page.addStyleTag({ content: `
  ${HIDE.concat(['.controls']).join(',')} { display: none !important; }
  ::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
  html, body { overflow: hidden !important; }
` });

// Fit the whole scene in frame. These pages are authored to scroll, so at
// native zoom the headline clips off the top and the last row of cards falls
// off the bottom -- a half-visible comparison grid undermines the slide it
// sits on. Measure the real content height and scale to fit, never up.
const fit = await page.evaluate((vh) => {
  const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const z = Math.min(1, vh / h);
  if (z < 1) {
    document.body.style.transformOrigin = 'top center';
    document.body.style.transform = `scale(${z})`;
    document.body.style.width = `${100 / z}%`;
    document.body.style.marginLeft = `${-(100 / z - 100) / 2}%`;
  }
  return { contentHeight: h, zoom: +z.toFixed(3) };
}, H);
console.log('fit:', JSON.stringify(fit));
await page.waitForTimeout(500);
console.log(`recording ${HOLD}ms`);
await page.waitForTimeout(HOLD);
await ctx.close();
await browser.close();
console.log('captured ->', OUT);
