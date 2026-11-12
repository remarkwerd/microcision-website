// THE MOST IMPORTANT TEST: the wording on every page must be exactly the
// captured Wix wording (baseline/text/<page>.txt), plus only the changes the
// owner approved (baseline/approved-changes.json).
//
// If this fails after you changed wording on purpose (for example a new job
// posting), update the matching baseline/text file in the same pull request.
import { test, expect } from '@playwright/test';
import { pages, lines, expectedLines } from './site';

const all = [...pages(), { path: '/this-page-does-not-exist/', slug: '_404' }];

for (const p of all) {
  test(`wording on ${p.path} matches the original`, async ({ page, browserName, isMobile }) => {
    test.skip(browserName !== 'chromium' || isMobile, 'Wording is checked once, in desktop Chrome.');
    await page.goto(p.path);
    const got = lines(await page.evaluate(() => document.body.innerText));
    const want = expectedLines(p.slug);
    const gotSet = new Set(got), wantSet = new Set(want);
    const missing = want.filter((l) => !gotSet.has(l));
    const added = got.filter((l) => !wantSet.has(l));
    expect.soft(missing, `Text from the original page that is MISSING on ${p.path}`).toEqual([]);
    expect.soft(added, `Text on ${p.path} that is NOT in the original (invented or changed)`).toEqual([]);
  });
}
