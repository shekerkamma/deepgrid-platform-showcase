// Regression checks for application visuals, inspectable figures, visual chapters,
// and native navigation. Run against the packaged GitHub Pages build.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const base =
  process.argv[2] || 'http://127.0.0.1:8771/deepgrid-platform-showcase/';
const out = process.argv[3] || 'visual-upgrade-shots';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const results = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(base + '#portfolio?category=Road+Autonomy&q=AD1');
    await page.locator('.product-card').waitFor();
    assert.equal(await page.locator('.product-card').count(), 1);
    const card = page.locator('.product-card');
    assert.match(await card.getAttribute('href'), /category=Road\+Autonomy/);
    assert.equal(await card.evaluate((el) => el.tagName), 'A');
    await card.click();
    await page.locator('.product-explainer').waitFor();
    assert.match(page.url(), /product=ad1/);
    assert.match(page.url(), /q=AD1/);
    assert.equal(await page.locator('.product-path li').count(), 4);
    await page.locator('.product-explainer').scrollIntoViewIfNeeded();
    await page.locator('.product-context img').evaluate((img) => img.decode());
    await page
      .locator('.product-explainer')
      .screenshot({ path: `${out}/product-${width}.png` });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page.goBack();
    await page.locator('.product-card').waitFor();
    assert.equal(await page.locator('.product-card').count(), 1);
    assert.match(page.url(), /q=AD1/);

    // Explicitly observe whether modifier navigation was intercepted; prevent
    // the default only after React has received the event, to avoid a real popup.
    const modified = await page.locator('.product-card').evaluate((el) => {
      let intercepted;
      const listener = (e) => {
        intercepted = e.defaultPrevented;
        e.preventDefault();
      };
      window.addEventListener('click', listener, { once: true });
      el.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          ctrlKey: true,
        }),
      );
      return intercepted;
    });
    assert.equal(modified, false, 'Ctrl-click must not be intercepted');

    await page.goto(base + '#slides');
    await page.locator('.chapter-atlas summary').click();
    assert.equal(await page.locator('.chapter-atlas-grid a').count(), 7);
    for (const image of await page.locator('.chapter-atlas-grid img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((img) => img.decode());
    }
    await page
      .locator('.chapter-atlas-grid')
      .screenshot({ path: `${out}/chapters-${width}.png` });
    await page.locator('.chapter-atlas-grid a').nth(3).click();
    await page.waitForFunction(() => location.hash === '#slides?slide=31');
    assert.match(
      await page.locator('.deck-stage img').getAttribute('src'),
      /slide_31/,
    );

    await page.goto(base + '#silicon');
    await page.locator('#domain-tab-A100').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(
      await page.locator('#domain-tab-R100').getAttribute('aria-selected'),
      'true',
    );
    assert.equal(
      await page.locator('#domain-detail').getAttribute('aria-labelledby'),
      'domain-tab-R100',
    );
    const figure = page.locator('.technical-image-link').first();
    await figure.waitFor();
    assert.equal(await figure.getAttribute('target'), '_blank');
    const response = await page.request.get(
      new URL(await figure.getAttribute('href'), page.url()).href,
    );
    assert.equal(response.ok(), true);

    await page.goto(base + '#overview');
    await page.locator('.hero-image').waitFor();
    assert.equal(await page.locator('.model-motion-toggle').isDisabled(), true);
    await page.locator('.hero-image').evaluate((img) => img.decode());
    const hero = await page
      .locator('.hero-image')
      .evaluate((img) => img.currentSrc);
    assert.match(hero, width === 390 ? /768.webp/ : /1536.webp/);
    const h = await page.evaluate(
      () => document.documentElement.scrollHeight - innerHeight,
    );
    for (let i = 0; i < 6; i++) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: 'instant' }),
        (h * i) / 5,
      );
      await page.waitForTimeout(850);
      await page.screenshot({ path: `${out}/overview-${width}-${i}.png` });
    }
    assert.deepEqual(errors, []);
    results.push({
      width,
      productContext: true,
      filteredBack: true,
      modifiedClick: true,
      chapterIndex: true,
      figureLink: true,
      responsiveHero: hero,
    });
    await page.close();
  }
  writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(
    'PASS visual upgrade: desktop and phone, reduced motion, native links, filtered back navigation, chapter index and responsive imagery',
  );
} finally {
  await browser.close();
}
