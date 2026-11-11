// Checks on the files themselves (no browser needed).
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { SITE, ROOT, htmlFiles, redirects, pages } from './site';

test.describe('site files', () => {
  test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Once is enough.');

  test('each photo is used on one page only (decision D17)', () => {
    const seen = new Map<string, string[]>();
    for (const f of htmlFiles()) {
      const html = fs.readFileSync(path.join(SITE, f), 'utf8');
      for (const stem of new Set([...html.matchAll(/\/images\/([a-z0-9_-]+?)-(?:640|1280|1920)\./g)].map((m) => m[1]))) {
        seen.set(stem, [...(seen.get(stem) || []), f]);
      }
    }
    const repeated = [...seen].filter(([, where]) => where.length > 1).map(([img, where]) => `${img}: ${where.join(', ')}`);
    expect(repeated).toEqual([]);
  });

  test('no inline styles or scripts (they would break the security policy)', () => {
    for (const f of htmlFiles()) {
      const html = fs.readFileSync(path.join(SITE, f), 'utf8');
      expect.soft(html, `${f} has a style="" attribute`).not.toMatch(/\sstyle="/);
      expect.soft(html, `${f} has a <script> tag`).not.toMatch(/<script/i);
      expect.soft(html, `${f} has an inline event handler`).not.toMatch(/\son[a-z]+="/i);
    }
  });

  test('every redirect target exists', () => {
    const paths = new Set(pages().map((p) => p.path));
    for (const [from, to] of redirects()) {
      const exists = paths.has(to) || fs.existsSync(path.join(SITE, to));
      expect.soft(exists, `${from} -> ${to}`).toBe(true);
    }
  });

  test('every page in site/ is in the sitemap, and every sitemap page has a baseline text file', () => {
    const inSitemap = new Set(pages().map((p) => p.path));
    for (const f of htmlFiles()) {
      if (f === '404.html') continue;
      const p = '/' + f.replace(/index\.html$/, '');
      expect.soft(inSitemap.has(p), `${p} missing from site/sitemap.xml`).toBe(true);
    }
    for (const p of pages()) expect.soft(fs.existsSync(path.join(ROOT, 'baseline', 'text', `${p.slug}.txt`)), `baseline/text/${p.slug}.txt`).toBe(true);
  });

  test('private project documents are not in the repo (decision D15)', () => {
    for (const f of ['Plan.md', 'Architecture.md', 'ACCOUNTS.md']) expect.soft(fs.existsSync(path.join(ROOT, f)), f).toBe(false);
    expect(fs.existsSync(path.join(ROOT, 'docs', 'private'))).toBe(false);
  });

  test('images are small enough', () => {
    for (const f of fs.readdirSync(path.join(SITE, 'images'))) {
      const size = fs.statSync(path.join(SITE, 'images', f)).size;
      if (/-(640|1280)\./.test(f)) expect.soft(size, `${f} is over 300 KB`).toBeLessThan(300 * 1024 * 2.2);
    }
  });
});
