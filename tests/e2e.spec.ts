// Every page loads and works, on desktop browsers and phones.
import { test, expect, Page } from '@playwright/test';
import { pages, wixTitle } from './site';

let AxeBuilder: any;
try { AxeBuilder = require('@axe-core/playwright').default; } catch { /* not installed locally */ }

const remote = !!process.env.BASE_URL;
const allowedHosts = new Set([new URL(process.env.BASE_URL || 'http://localhost:4173').host]);

async function scrollThrough(page: Page) {
  // Lazy-loaded photos only load when scrolled into view: visit each one.
  await page.evaluate(async () => {
    for (const img of [...document.images].filter((i) => i.offsetParent !== null)) {
      img.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 50));
      if (!img.complete) await new Promise((r) => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); setTimeout(r, 5000); });
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
}

for (const p of pages()) {
  test.describe(p.path, () => {
    test('loads with no errors, no outside requests and all images', async ({ page }) => {
      const problems: string[] = [];
      page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
      page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`));
      page.on('request', (r) => { const u = new URL(r.url()); if (/^https?:$/.test(u.protocol) && !allowedHosts.has(u.host)) problems.push(`outside request: ${r.url()}`); });
      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      await scrollThrough(page);
      expect(problems).toEqual([]);

      const title = await page.title();
      const wix = wixTitle(p.slug);
      if (wix) expect(title).toBe(wix); else expect(title).toMatch(/ \| Microcision$/);
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.locator('h1').innerText()).trim()).not.toBe('');

      const images = await page.evaluate(() => [...document.images].map((i) => ({
        src: i.currentSrc || i.src, visible: i.offsetParent !== null, ok: i.complete && i.naturalWidth > 0,
        w: i.getAttribute('width'), h: i.getAttribute('height'), alt: i.getAttribute('alt'),
      })));
      for (const img of images) {
        expect.soft(img.w && img.h, `width/height set on ${img.src}`).toBeTruthy();
        expect.soft(img.alt, `alt attribute present on ${img.src}`).not.toBeNull();
        if (img.visible) expect.soft(img.ok, `image loads: ${img.src}`).toBe(true);
      }
      const sideways = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(sideways, 'page scrolls sideways').toBe(false);
    });

    test('has no serious accessibility problems', async ({ page, browserName, isMobile }) => {
      test.skip(!AxeBuilder, '@axe-core/playwright is not installed');
      test.skip(browserName !== 'chromium', 'Checked in Chrome only.');
      await page.goto(p.path);
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter((v: any) => v.impact === 'serious' || v.impact === 'critical')
        .map((v: any) => `${v.id}: ${v.help} (${v.nodes.length}x)`);
      expect(bad, isMobile ? 'phone layout' : 'desktop layout').toEqual([]);
    });
  });
}

test('menu: every link goes to a real page', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('header a[href^="/"]').evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')!.split('#')[0]))]);
  for (const href of hrefs) {
    const res = await page.request.get(href);
    expect(res.status(), href).toBe(200);
  }
  await expect(page.locator('header a.logo')).toHaveAttribute('href', '/');
});

test('menu opens on a phone', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Phone only.');
  await page.goto('/');
  const history = page.locator('header nav a[href="/history/"]');
  await expect(history).toBeHidden();
  await page.locator('label[for="nav-toggle"]').click();
  await expect(history).toBeVisible();
  await history.click();
  await expect(page).toHaveURL(/\/history\/?$/);
});

test('keyboard: Tab reaches the menu and the contact form', async ({ page, browserName, isMobile }) => {
  test.skip(isMobile || browserName === 'webkit', 'Desktop keyboard check (Safari skips links on Tab by default).');
  await page.goto('/');
  const reached = new Set<string>();
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab');
    reached.add(await page.evaluate(() => (document.activeElement as HTMLElement)?.getAttribute('href') || (document.activeElement as HTMLInputElement)?.name || ''));
  }
  for (const want of ['#main', '/', '/expansion/', '/careers/', 'name', 'email']) expect(reached, `Tab reaches ${want}`).toContain(want);
});

test.describe('contact form', () => {
  test('blocks an empty submit and has a hidden honeypot', async ({ page }) => {
    await page.goto('/#contact');
    const form = page.locator('form[name="contact"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await form.getByRole('button').click();
    expect(await page.locator('input[name="name"]').evaluate((i: HTMLInputElement) => i.validity.valueMissing)).toBe(true);
    await expect(page).toHaveURL(/\/(#contact)?$/);
    // The honeypot sits off-screen (bots fill it in, people never see it).
    const box = await page.locator('input[name="company-website"]').boundingBox();
    expect(box && box.x + box.width <= 0).toBe(true);
    await expect(page.locator('.hp')).toHaveAttribute('aria-hidden', 'true');
  });

  test('a filled form submits (only against a Netlify address)', async ({ page, browserName, isMobile }) => {
    test.skip(!remote || browserName !== 'chromium' || isMobile, 'Needs Netlify; sends one message per run.');
    test.skip(!process.env.SEND_FORM, 'Set SEND_FORM=1 to send a real test message.');
    await page.goto('/#contact');
    await page.fill('input[name="name"]', 'E2E TEST – ignore');
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('textarea[name="message"]', 'Automated website test. Please ignore.');
    const [res] = await Promise.all([page.waitForResponse((r) => r.request().method() === 'POST'), page.getByRole('button', { name: 'SEND' }).click()]);
    expect(res.status()).toBeLessThan(400);
  });
});

test('unknown page returns 404 and the 404 page', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('404');
});
