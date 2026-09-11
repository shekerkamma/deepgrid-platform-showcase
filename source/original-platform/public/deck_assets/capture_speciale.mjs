import { chromium } from '/home/sheke/content-ideas/node_modules/playwright/index.mjs';
import { readdirSync, existsSync } from 'node:fs';

// Capture one slide of the Speciale deck as a clip.
// Its animations are gated on `.slide.active`, and several (fps bars, ladder
// rungs) are one-shot entry transitions -- so arrive on the slide WHILE
// recording, otherwise they have already finished by the first frame.
const [SRC, OUT, N, HOLD] = [process.argv[2], process.argv[3], Number(process.argv[4]), Number(process.argv[5]||30000)];
const ROOT='/home/sheke/.cache/ms-playwright';
const EXEC=readdirSync(ROOT).filter(d=>/^chromium-\d+$/.test(d))
  .sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]))
  .map(b=>`${ROOT}/${b}/chrome-linux64/chrome`).find(existsSync);
if(!EXEC){ console.error('BLOCKED: no chromium'); process.exit(1); }

const W=1600,H=900;
const browser=await chromium.launch({executablePath:EXEC, headless:false,
  args:[`--window-size=${W},${H}`,'--autoplay-policy=no-user-gesture-required','--hide-scrollbars']});
const ctx=await browser.newContext({viewport:{width:W,height:H},
  recordVideo:{dir:OUT,size:{width:W,height:H}}});
const page=await ctx.newPage();
await page.goto('file://'+SRC,{waitUntil:'load'});
await page.waitForTimeout(2500);
// nav chrome is dead UI in a video
await page.addStyleTag({content:`
  .arrow,#prev,#next,#dots,.prog,.hud,.counter{display:none!important;}
  ::-webkit-scrollbar{width:0!important;height:0!important;}
`});
// land on the slide BEFORE the target, then advance on camera
await page.keyboard.press('Home');
await page.waitForTimeout(1200);
for(let k=1;k<N-1;k++){ await page.keyboard.press('ArrowRight'); await page.waitForTimeout(220); }
await page.waitForTimeout(2500);
await page.keyboard.press('ArrowRight');          // entry animation plays here
const at=await page.evaluate(()=>document.getElementById('cur')?.textContent);
console.log('now on slide', at);
await page.waitForTimeout(HOLD);
await ctx.close();
await browser.close();
console.log('captured ->', OUT);
