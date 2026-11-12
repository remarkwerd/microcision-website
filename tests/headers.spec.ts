// Security headers come from netlify.toml, so this runs only against Netlify.
// The header list is added in Phase 7 of the project plan; until then the
// test is marked "fixme" and does not fail the build.
import { test, expect } from '@playwright/test';

test.skip(!process.env.BASE_URL, 'Needs a Netlify address in BASE_URL.');
test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Once is enough.');

const expected: Record<string, RegExp> = {
  'content-security-policy': /default-src 'self'/,
  'strict-transport-security': /max-age=\d+/,
  'x-content-type-options': /^nosniff$/,
  'referrer-policy': /^strict-origin-when-cross-origin$/,
  'permissions-policy': /camera=\(\)/,
  'x-frame-options': /^DENY$/,
};

test.fixme('security headers are present', async ({ request }) => {
  const res = await request.get('/');
  const h = res.headers();
  for (const [name, re] of Object.entries(expected)) expect.soft(h[name], name).toMatch(re);
  expect(h['strict-transport-security'] || '').not.toMatch(/includeSubDomains|preload/i);
});
