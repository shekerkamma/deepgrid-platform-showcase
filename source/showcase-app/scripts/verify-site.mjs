// Browser gate for the showcase, adapted from the DG32 site's scripts/verify-site.mjs. Run it on a
// local build or the live URL after every deploy.
//
//   PLAYWRIGHT=/path/to/playwright/index.mjs node scripts/verify-site.mjs [url] [screenshot dir]
//
// PLAYWRIGHT falls back to the bare 'playwright' import. Exit 1 on any failure.
//
// What it proves, and why each check exists:
// - Every view fits at 1440 and 390 px, with no broken image, failed request, console error or
//   visible em dash, and every reveal target finished (revealed class present, computed opacity 1
//   after a scroll-through). A screenshot cannot tell a block that faded in from one never shown.
// - Two clocks pins under the navigation on desktop and its events appear in order as the page
//   scrolls (more events on at each of four positions, all eight at the end, the bridge laid last).
//   On a phone it becomes one chronological list; under reduced motion the chart is not pinned.
//   Either way every event is visible at once.
// - Products switch to the comparison table and it sorts; a product dossier opens with its slide.
// - The slide deck steps with the arrow keys and its filmstrip marks the current slide.
// - Every film has a poster that loads and a caption track that returns WebVTT, and every document
//   in the Investment list downloads (HTTP 200, non-empty).
// Scripted scrolls use behavior 'instant': the site sets scroll-behavior: smooth, and an animated
// scrollTo makes every position measured after it wrong.
import { mkdirSync } from 'node:fs';
const pw = await import(process.env.PLAYWRIGHT || 'playwright');
const { chromium } = pw.chromium ? pw : pw.default;
const BASE =
  process.argv[2] || 'http://127.0.0.1:8771/deepgrid-platform-showcase/';
const OUT = process.argv[3] || 'verify-shots';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const fails = [],
  errors = [],
  failed = [];
const fail = (m) => {
  fails.push(m);
  console.log('  FAIL', m);
};
const watch = (p, tag) => {
  p.on('pageerror', (e) => errors.push(`${tag} ${e}`));
  p.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${tag} ${m.text()}`);
  });
  // films stream from the content-ideas site; a range request aborted by navigation is not a failure
  p.on('response', (r) => {
    if (r.status() >= 400) failed.push(`${tag} ${r.status()} ${r.url()}`);
  });
};
const frames = (p) =>
  p.evaluate(
    () =>
      new Promise((res) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(res)),
        ),
      ),
  );
const instant = (p, y) =>
  p.evaluate((v) => scrollTo({ top: v, behavior: 'instant' }), y);

// 1. views at both widths
const routes = [
  'overview',
  'portfolio',
  'portfolio?layout=table',
  'silicon',
  'briefing',
  'film',
  'slides',
  'investment',
];
for (const { tag, viewport } of [
  { tag: 'desktop', viewport: { width: 1440, height: 900 } },
  { tag: 'phone', viewport: { width: 390, height: 844 } },
]) {
  const p = await b.newPage({ viewport });
  watch(p, tag);
  for (const r of routes) {
    await p.goto(BASE + '#' + r, { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    await frames(p);
    await p.evaluate(async () => {
      for (let y = 0; y <= document.documentElement.scrollHeight; y += 500) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise((res) => setTimeout(res, 70));
      }
      await new Promise((res) => setTimeout(res, 1200));
    });
    await frames(p);
    await p.evaluate(async () => {
      const t0 = performance.now();
      while (
        document.querySelector('[data-rv].rv-in:not(.rv-done)') &&
        performance.now() - t0 < 3000
      )
        await new Promise((res) => setTimeout(res, 100));
    });
    const m = await p.evaluate(() => {
      const text = document.querySelector('main').innerText,
        targets = [...document.querySelectorAll('[data-rv]')];
      return {
        fits:
          document.documentElement.scrollWidth ===
          document.documentElement.clientWidth,
        targets: targets.length,
        unrevealed: targets.filter(
          (e) =>
            !e.classList.contains('rv-in') ||
            parseFloat(getComputedStyle(e).opacity) < 0.99,
        ).length,
        broken: [...document.images]
          .filter((i) => i.complete && i.naturalWidth === 0)
          .map((i) => i.getAttribute('src')),
        dashes: (text.match(/—/g) || []).length,
        imgNoSize: [...document.querySelectorAll('main img')].filter(
          (i) => !i.getAttribute('width') || !i.getAttribute('height'),
        ).length,
        h1: document.querySelectorAll('main h1').length,
        fonts: [...document.fonts].some(
          (f) => f.family.includes('Newsreader') && f.status === 'loaded',
        ),
      };
    });
    console.log(tag, r, JSON.stringify(m));
    if (!m.fits) fail(`${tag} ${r}: horizontal overflow`);
    if (m.unrevealed)
      fail(
        `${tag} ${r}: ${m.unrevealed} of ${m.targets} reveal targets never finished`,
      );
    if (m.broken.length) fail(`${tag} ${r}: broken images ${m.broken}`);
    if (m.dashes) fail(`${tag} ${r}: ${m.dashes} visible em dash(es)`);
    if (m.imgNoSize)
      fail(`${tag} ${r}: ${m.imgNoSize} image(s) without width/height`);
    if (r !== 'overview' && m.h1 !== 1)
      fail(`${tag} ${r}: ${m.h1} h1 elements`);
    if (!m.fonts) fail(`${tag} ${r}: display font not loaded`);
    await instant(p, 0);
    await p.screenshot({
      path: `${OUT}/${tag}-${r.replace(/[^a-z]/g, '-')}.png`,
    });
  }
  await p.close();
}

// 2. two clocks: pinned and ordered on desktop, static and complete on a phone and under reduced motion
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p, 'clocks');
  await p.goto(BASE + '#overview', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const g = await p.evaluate(() => {
    const s = document.querySelector('.ov-clocks'),
      r = s.getBoundingClientRect();
    return {
      pinned: s.classList.contains('is-pinned'),
      top: r.top + scrollY,
      h: r.height,
      nav: document.querySelector('.main-nav').offsetHeight,
    };
  });
  if (!g.pinned) fail('clocks: not pinned at 1440');
  let last = -1;
  for (const k of [0.05, 0.35, 0.65, 1]) {
    await instant(p, g.top - g.nav + k * (g.h - 900 + g.nav));
    await p.waitForTimeout(450);
    const s = await p.evaluate(() => {
      const st = document
        .querySelector('.ov-clocks-stage')
        .getBoundingClientRect();
      const bridge = getComputedStyle(
        document.querySelector('.ov-bridge'),
      ).getPropertyValue('--k');
      return {
        on: document.querySelectorAll('.ov-lane li.is-on').length,
        stageTop: Math.round(st.top),
        bridge: parseFloat(bridge),
      };
    });
    console.log('clocks', k, JSON.stringify(s));
    if (Math.abs(s.stageTop - g.nav) > 2)
      fail(
        `clocks ${k}: stage top ${s.stageTop}, expected under the nav at ${g.nav}`,
      );
    if (s.on < last || (k > 0.05 && s.on === last && s.on < 8))
      fail(`clocks ${k}: events did not advance (${last} -> ${s.on})`);
    if (k === 1 && (s.on !== 8 || s.bridge < 0.99))
      fail(`clocks end: ${s.on}/8 events, bridge ${s.bridge}`);
    last = s.on;
    await p.screenshot({ path: `${OUT}/clocks-${k}.png` });
  }
  await p.close();
  for (const { tag, opts } of [
    { tag: 'phone', opts: { viewport: { width: 390, height: 844 } } },
    {
      tag: 'reduced',
      opts: { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
    },
  ]) {
    const q = await b.newPage(opts);
    await q.goto(BASE + '#overview', { waitUntil: 'networkidle' });
    await q.waitForTimeout(600);
    const s = await q.evaluate(() => ({
      pinned: document
        .querySelector('.ov-clocks')
        .classList.contains('is-pinned'),
      visible: [
        ...document.querySelectorAll('.ov-lane li, .ov-clocks-list li'),
      ].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.99).length,
    }));
    console.log('clocks', tag, JSON.stringify(s));
    if (s.pinned || s.visible !== 8)
      fail(`clocks ${tag}: pinned=${s.pinned}, ${s.visible}/8 events visible`);
    await q.close();
  }
}

// 3. products: comparison table sorts, dossier opens with its source slide
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p, 'products');
  await p.goto(BASE + '#portfolio?layout=table', { waitUntil: 'networkidle' });
  const first = () =>
    p.evaluate(
      () => document.querySelector('.compare-table tbody th').innerText,
    );
  const byRevenue = await first();
  await p.click('.compare-table thead th:nth-child(3) button');
  const byPrice = await first();
  if (byRevenue === byPrice)
    fail(`products: sorting by price left ${byRevenue} first`);
  await p.click('.compare-table tbody .row-link');
  await p.waitForSelector('.product-dialog .detail-slide img');
  const ok = await p.evaluate(() => {
    const i = document.querySelector('.detail-slide img');
    return new Promise((res) => {
      if (i.complete) res(i.naturalWidth > 0);
      else {
        i.onload = () => res(true);
        i.onerror = () => res(false);
      }
    });
  });
  if (!ok) fail('products: dossier slide image did not load');
  await p.close();
}

// 4. slide deck: arrow keys step, filmstrip follows
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p, 'deck');
  await p.goto(BASE + '#slides?slide=5', { waitUntil: 'networkidle' });
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(200);
  const s = await p.evaluate(() => ({
    hash: location.hash,
    strip: document.querySelector('.deck-strip [aria-current="true"] span')
      ?.textContent,
  }));
  if (!s.hash.includes('slide=6') || s.strip !== '6')
    fail(`deck: ArrowRight from 5 gave ${s.hash}, strip ${s.strip}`);
  await p.close();
}

// 5. films and documents
{
  const p = await b.newPage();
  watch(p, 'assets');
  await p.goto(BASE + '#film', { waitUntil: 'networkidle' });
  const r = await p.evaluate(async () => {
    const out = [];
    for (const v of document.querySelectorAll('video')) {
      const track = v.querySelector('track').src,
        poster = v.poster;
      const t = await fetch(track)
        .then((x) => x.text())
        .catch(() => '');
      const pr = await fetch(poster)
        .then((x) => x.status)
        .catch(() => 0);
      out.push({
        track,
        vtt: t.startsWith('WEBVTT') && t.includes('-->'),
        poster: pr,
      });
    }
    return out;
  });
  for (const f of r) {
    if (!f.vtt) fail(`films: caption track is not WebVTT: ${f.track}`);
    if (f.poster !== 200) fail(`films: poster ${f.poster} for ${f.track}`);
  }
  await p.goto(BASE + '#investment', { waitUntil: 'networkidle' });
  const docs = await p.evaluate(async () =>
    Promise.all(
      [...document.querySelectorAll('.inv-docs a')].map(async (a) => {
        const x = await fetch(a.href, { method: 'HEAD' });
        return {
          href: a.getAttribute('href'),
          status: x.status,
          size: Number(x.headers.get('content-length') || 0),
        };
      }),
    ),
  );
  for (const d of docs)
    if (d.status !== 200 || !d.size)
      fail(`documents: ${d.href} ${d.status} ${d.size} bytes`);
  console.log('films', r.length, 'documents', docs.length);
  await p.close();
}

await b.close();
for (const e of errors) fail('console ' + e);
for (const f of failed) fail('request ' + f);
console.log(
  fails.length ? `\n${fails.length} failure(s)` : '\nall checks passed',
);
process.exit(fails.length ? 1 : 0);
