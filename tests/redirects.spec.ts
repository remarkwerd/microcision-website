// Old Wix addresses keep working. Runs only against Netlify (BASE_URL set),
// because the redirects in netlify.toml are applied by Netlify.
import { test, expect } from '@playwright/test';
import { pages, redirects } from './site';

test.skip(!process.env.BASE_URL, 'Needs a Netlify address in BASE_URL.');
test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Once is enough.');

for (const [from, to, status] of redirects()) {
  test(`${from} redirects to ${to}`, async ({ request }) => {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status()).toBe(status);
    expect(new URL(res.headers()['location'], 'https://x').pathname).toBe(to);
  });
}

for (const p of pages()) {
  for (const variant of new Set([p.path, p.path.replace(/\/$/, '') || '/'])) {
    test(`old address ${variant} still works`, async ({ request }) => {
      const res = await request.get(variant);
      expect(res.status()).toBe(200);
    });
  }
}
