// Shared helpers for the tests. Plain data, no test code.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(__dirname, '..');
export const SITE = path.join(ROOT, 'site');
export const BASELINE = path.join(ROOT, 'baseline');

/** Every page in site/sitemap.xml, as { path: '/history/', slug: 'history' }. */
export function pages(): { path: string; slug: string }[] {
  const xml = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>https:\/\/www\.microcision\.com(\/[^<]*)<\/loc>/g)].map((m) => {
    const p = m[1];
    return { path: p, slug: p === '/' ? 'home' : p.replace(/^\/|\/$/g, '') };
  });
}

/** Same normalizing on both sides: drop zero-width spaces, NBSP -> space, collapse spaces, drop empty lines. */
export function lines(text: string): string[] {
  return text
    .replace(/​/g, '')
    .replace(/ /g, ' ')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/** The approved wording for a page: the captured Wix text plus approved-changes.json. */
export function expectedLines(slug: string): string[] {
  let want = lines(fs.readFileSync(path.join(BASELINE, 'text', `${slug}.txt`), 'utf8'));
  const changes = JSON.parse(fs.readFileSync(path.join(BASELINE, 'approved-changes.json'), 'utf8'))[slug];
  if (changes?.replace) want = want.map((l) => changes.replace[l] ?? l);
  if (changes?.add) want = want.concat(changes.add);
  return want;
}

/** The original <title> captured from Wix, if this page existed there. */
export function wixTitle(slug: string): string | undefined {
  const f = path.join(BASELINE, 'raw', `${slug}.meta.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).title : undefined;
}

/** Redirect rules from netlify.toml as [from, to, status]. */
export function redirects(): [string, string, number][] {
  const toml = fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8');
  return [...toml.matchAll(/\[\[redirects\]\]\s*from = "([^"]+)"\s*to = "([^"]+)"\s*status = (\d+)/g)].map((m) => [m[1], m[2], Number(m[3])]);
}

/** Every HTML file under site/, relative paths. */
export function htmlFiles(): string[] {
  return (fs.readdirSync(SITE, { recursive: true }) as string[]).filter((f) => f.endsWith('.html'));
}
