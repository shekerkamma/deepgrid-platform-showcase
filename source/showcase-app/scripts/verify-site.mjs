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
// - Products switch to the comparison table and it sorts; a row opens that product's page.
// - Every product page opens with the case in brief and its use cases, tells its story in chapters with data
//   pills, shows no slide images, and labels every link with its destination; the walkthrough link lands on the
//   film at the product's time; Ask opens on a linked question.
// - Ask answers show the image linked to what they rest on, captioned from the image, with a named source link; a
//   question no image fits shows none.
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

// 3. products: the comparison table sorts, and a row opens that product's page
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
  // the page's story starts from the product's own "What it is" slide, so the row opened the right product
  const rowName = await first();
  await p.click('.compare-table tbody .row-link');
  const opened = await p
    .waitForSelector('.product-page .pp-chapter-source a', { timeout: 8000 })
    .then(
      () => true,
      () => false,
    );
  const page = await p.evaluate(() => ({
    h1: document.querySelector('main h1')?.textContent,
    slide: document.querySelector('.pp-chapter-source a')?.textContent,
  }));
  if (!opened || page.h1 !== rowName || !/What it is$/.test(page.slide || ''))
    fail(
      `products: row "${rowName}" opened "${page.h1}", first chapter cites "${page.slide}"`,
    );
  await p.close();
}

// 3b. product pages, as an executive reads them: the case in brief first, then use cases, then the story in chapters
// with data pills; no slide images; and no link labelled with a bare verb ("Read", "Open slide", "PDF") or going nowhere.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p, 'product');
  await p.goto(BASE + '#portfolio', { waitUntil: 'networkidle' });
  const cards = await p.evaluate(
    () => document.querySelectorAll('.catalog-list .product-card').length,
  );
  if (cards !== 15) fail(`products: ${cards} cards, expected 15`);
  const BARE = /^(read|open|open slide|pdf|download|more|link|source)$/i;
  for (const id of [
    'ad2',
    'ad0',
    'taas',
    'chipset',
    't100',
    'ad1',
    'a100-4',
    'dhumr',
    'a100-2',
    'a100-1',
    'agv',
    'd100',
    'thermal',
    'h100',
    'radar',
  ]) {
    await p.goto(BASE + '#portfolio?product=' + id, {
      waitUntil: 'networkidle',
    });
    const m = await p.evaluate(() => ({
      blocks: [...document.querySelectorAll('.product-page > .pp-block')].map(
        (s) => s.querySelector('h2')?.textContent,
      ),
      takeaways: document.querySelectorAll('.pp-case li').length,
      uses: document.querySelectorAll('.pp-usecase').length,
      chapters: [...document.querySelectorAll('.pp-chapter')].filter(
        (c) => c.querySelectorAll('.pp-pills li').length >= 2,
      ).length,
      images: document.querySelectorAll('.product-page img').length,
      labels: [...document.querySelectorAll('.product-page a')].map((a) =>
        (a.querySelector('strong')?.textContent || a.textContent).trim(),
      ),
      dead: [...document.querySelectorAll('.product-page a')].filter(
        (a) => !a.getAttribute('href') || a.getAttribute('href') === '#',
      ).length,
      pager: !!document.querySelector('main > .section-pagination'),
    }));
    const bare = m.labels.filter((t) => BARE.test(t));
    if (
      m.blocks[0] !== 'The case in brief' ||
      m.blocks[1] !== 'What it is used for' ||
      m.takeaways < 2 ||
      m.uses < 2 ||
      m.chapters < 4 ||
      m.images ||
      bare.length ||
      m.dead ||
      m.pager
    )
      fail(
        `product ${id}: ${m.blocks.slice(0, 2).join(' > ')}; ${m.takeaways} takeaways, ${m.uses} use cases, ${m.chapters} chapters with pills, ${m.images} images, bare [${bare}], ${m.dead} dead links, site pager ${m.pager}`,
      );
  }
  // the walkthrough link lands on the master film at the product's moment
  await p.goto(BASE + '#portfolio?product=ad2', { waitUntil: 'networkidle' });
  await p
    .click('.pp-more a[href^="#film?v=master"]', { timeout: 5000 })
    .catch(() => fail('walkthrough link missing on the AD2 page'));
  await p.waitForTimeout(400);
  const w = await p.evaluate(() => ({
    hash: location.hash,
    src:
      document.querySelector('#film-master source')?.getAttribute('src') || '',
  }));
  if (
    !w.hash.startsWith('#film?v=master&t=') ||
    !w.src.includes('#t=' + w.hash.split('t=')[1])
  )
    fail(`walkthrough link: ${w.hash} -> ${w.src}`);
  // Ask opens on the question a product page sends
  await p.goto(
    BASE + '#briefing?q=' + encodeURIComponent('Tell me about the Seaport AGV'),
    { waitUntil: 'networkidle' },
  );
  await p
    .waitForFunction(
      () => document.querySelector('.dr-ask-input')?.value,
      null,
      { timeout: 15000 },
    )
    .catch(() => {});
  const q = await p.evaluate(
    () => document.querySelector('.dr-ask-input')?.value,
  );
  if (q !== 'Tell me about the Seaport AGV')
    fail(`ask deep link: input holds "${q}"`);
  await p.close();
}

// 3c. images beside Ask answers: the right image or none. Linked images carry the vision model's description as caption
// and a source link naming where they come from; a question no image fits shows none (a road simulator was once shown as
// a "bearing vibration spectrum").
{
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  watch(p, 'ask-images');
  for (const [q, want] of [
    ['What is the Seaport AGV?', 'slides/slide_68.png'],
    ['What is the revenue ramp to FY2032?', 'images/figure-12.webp'],
    ['Why does kurtosis stop rising as a bearing degrades?', null],
  ]) {
    await p.goto(BASE + '#briefing?q=' + encodeURIComponent(q), {
      waitUntil: 'networkidle',
    });
    // Ask answers by keywords first and re-answers once the in-browser model is loaded; judge the settled answer
    await p
      .waitForSelector('.dr-grounded-answer-wrap[data-semantic="on"]', {
        timeout: 20000,
      })
      .catch(() => fail(`ask "${q}": semantic ranking never came on`));
    await p.waitForTimeout(300);
    const c = await p.evaluate(() => {
      const card = document.querySelector('.dr-visual-evidence-card');
      return card
        ? {
            img: card.querySelector('img')?.getAttribute('src'),
            source: card
              .querySelector('.dr-visual-source')
              ?.textContent?.trim(),
            caption: card.querySelector('.dr-visual-caption')?.textContent,
          }
        : null;
    });
    if (
      want === null
        ? c
        : !c ||
          !c.img?.endsWith(want) ||
          !c.source ||
          /^(read|open|source)/i.test(c.source) ||
          (c.caption || '').length < 40
    )
      fail(
        `ask image for "${q}": expected ${want || 'none'}, got ${JSON.stringify(c)}`,
      );
  }
  await p.close();
}

// 3c. technology, told in chapters like the Overview: every chapter is named in the chapter nav, has a verdict headline, a lede, 3 to 6
// pills, technical detail and at least one reference, and every reference is labelled (never a bare verb) and goes
// somewhere: deck slides open in the deck, memorandum pages as PDFs that exist.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p, 'technology');
  await p.goto(BASE + '#silicon', { waitUntil: 'networkidle' });
  const BARE = /^(read|open|open slide|pdf|download|more|link|source)$/i;
  const chapters = await p.evaluate(async () =>
    Promise.all(
      [...document.querySelectorAll('.tech-chapter')].map(async (c) => ({
        id: c.id,
        kicker:
          document
            .querySelector(`.tech-nav a[href="#${c.id}"]`)
            ?.textContent.trim() || '',
        headline: c.querySelector('h2')?.textContent.trim() || '',
        lede:
          c
            .querySelector('.ov-chapter-head > p:not(.kicker)')
            ?.textContent.trim() || '',
        pills: c.querySelectorAll('.pp-pills li').length,
        detail:
          c.querySelector('.tech-detail p')?.textContent.trim().length || 0,
        refs: await Promise.all(
          [...c.querySelectorAll('.tech-refs a')].map(async (a) => ({
            label: a.textContent.trim(),
            href: a.getAttribute('href'),
            status: a.getAttribute('href').startsWith('#')
              ? 200
              : await fetch(a.href.split('#')[0], { method: 'HEAD' })
                  .then((x) => x.status)
                  .catch(() => 0),
          })),
        ),
      })),
    ),
  );
  if (chapters.length !== 7)
    fail(`technology: ${chapters.length} chapters, expected 7`);
  for (const c of chapters) {
    const bad = c.refs.filter(
      (r) => BARE.test(r.label) || !r.href || r.status !== 200,
    );
    if (
      !c.kicker ||
      !c.headline ||
      !c.lede ||
      c.pills < 3 ||
      c.pills > 6 ||
      c.detail < 80 ||
      !c.refs.length ||
      bad.length
    )
      fail(
        `technology ${c.id}: kicker "${c.kicker}", ${c.pills} pills, detail ${c.detail} chars, ${c.refs.length} refs, bad [${bad.map((r) => r.label + ' ' + r.status)}]`,
      );
  }
  // a deck reference opens that slide
  await p.click('#tech-cube .tech-refs a[href^="#slides?slide="]');
  await p.waitForTimeout(500);
  if (!(await p.evaluate(() => location.hash.startsWith('#slides?slide='))))
    fail('technology: a deck reference did not open the deck');
  // a product page links to its domain on the die: the Radar Pod opens Six domains with R100 selected, in view
  await p.goto(BASE + '#portfolio?product=radar', { waitUntil: 'networkidle' });
  await p
    .click('.pp-more a[href="#silicon?chapter=domains&domain=R100"]', {
      timeout: 5000,
    })
    .catch(() =>
      fail('radar page: no link to its domain on the Technology page'),
    );
  await p.waitForTimeout(800);
  const landed = await p.evaluate(() => ({
    tab:
      document.querySelector('#tech-domains [role=tab][aria-selected=true]')
        ?.textContent || '',
    top: Math.round(
      document.getElementById('tech-domains')?.getBoundingClientRect().top ??
        -1,
    ),
  }));
  if (!landed.tab.includes('R100') || landed.top < -5 || landed.top > 200)
    fail(
      `radar -> technology: tab "${landed.tab}", chapter top ${landed.top}px`,
    );
  console.log(
    `technology: ${chapters.length} chapters, ${chapters.reduce((n, c) => n + c.refs.length, 0)} labelled references`,
  );
  await p.close();
}

// 3d. cross-references: every section links to the related items in the others, labelled by destination, and a
// link followed lands where it says. Slide 44 leads to the eight-layer cube chapter; the cube film leads back to it;
// the memorandum's technology chapter leads to the Silicon platform; a use case leads to its product lines.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  watch(p, 'related');
  const BARE = /^(read|open|open slide|pdf|download|more|link|source|watch)$/i;
  for (const [hash, scope, expect] of [
    ['slides?slide=44', '.slide-commentary .related', '#silicon?chapter=cube'],
    ['film', '#film-cube .related', '#silicon?chapter=cube'],
    ['film', '#film-truck .related', '#portfolio?product=ad2'],
    [
      'investment?chapter=technology',
      '.record-reader .related',
      '#silicon?chapter=domains',
    ],
    [
      'investment?chapter=usecases&usecase=UC-04',
      '.usecase-explorer .related',
      '#portfolio?product=ad2',
    ],
    ['silicon', '#tech-sensors .related', '#portfolio?product=ad2'],
  ]) {
    await p.goto(BASE + '#' + hash, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const m = await p.evaluate(
      ([scope, expect]) => {
        const links = [...document.querySelectorAll(scope + ' a')];
        return {
          n: links.length,
          bare: links
            .map((a) =>
              (a.querySelector('strong')?.textContent || a.textContent).trim(),
            )
            .filter((t) => !t),
          has: links.some((a) => a.getAttribute('href') === expect),
        };
      },
      [scope, expect],
    );
    if (!m.n || m.bare.length || !m.has || m.bare.some((t) => BARE.test(t)))
      fail(
        `related on #${hash}: ${m.n} links, expected one to ${expect} (${m.has}), ${m.bare.length} unlabelled`,
      );
  }
  // follow one: the cube film's related chapter opens the Silicon platform at that chapter
  await p.goto(BASE + '#film', { waitUntil: 'networkidle' });
  await p.click('#film-cube .related a[href="#silicon?chapter=cube"]');
  await p.waitForTimeout(900);
  const top = await p.evaluate(() =>
    Math.round(
      document.getElementById('tech-cube')?.getBoundingClientRect().top ?? -1,
    ),
  );
  if (top < -5 || top > 200)
    fail(`related link from the cube film landed with the chapter at ${top}px`);
  console.log(
    'related: 6 sections cross-link, and a followed link lands on its chapter',
  );
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
  if (r.length !== 12)
    fail(`films: ${r.length} players on the Videos page, expected 12`);
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
