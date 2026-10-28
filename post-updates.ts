import { execFileSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { posix as path } from 'path';

// Post "last updated" lines, from git history.
//
// The line is static markup written into each post's template, so the client gets no extra
// code for it. deploy.ts writes the lines on the build machine, after `git fetch --unshallow`
// (Cloudflare Pages clones shallow). They are never committed: like the commit sha in the
// environment files, they exist only in the build's working tree.
//
// This file is at the repository root, next to deploy.ts, because deploy.ts imports it and
// tsconfig.deploy.json compiles both. The src/generate-*.mjs scripts are plain JS run by `build`.
// Run it by hand with `node post-updates.ts` (Node 22.18 or later runs .ts files directly).

const REGISTRY_FILE = 'src/app/pages/blog/blog-registry.ts';
const POSTS_DIR = 'src/app/pages/blog/posts';
const ASSETS_DIR = 'src/app/assets';
export const IGNORE_FILE = 'src/app/pages/blog/post-updates-ignore.txt';

// Attribute values that are part of what a reader sees or follows, also as Angular bindings
// ([src], [attr.href], ...). Everything else (class, width, priority, datetime, ...) is markup.
const CONTENT_ATTRIBUTES = ['alt', 'title', 'src', 'ngsrc', 'srcset', 'href', 'routerlink'];

// The generated line goes right before the back link that ends every post.
const BACK_LINK = /^[ \t]*<br\s*\/?>\s*<br\s*\/?>\s*<a\s+class="back"/m;
const BLOCK = /^[ \t]*<!-- post-updated [\s\S]*?<!-- \/post-updated -->\n/m;

export interface PostUpdate {
  sha: string;
  date: string; // YYYY-MM-DD, committer's local date
}

interface Commit {
  sha: string;
  date: string;
  parent?: string;
  status: string;
  oldPath: string;
  newPath: string;
}

function git(...args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 5 * 60 * 1000,
  });
}

function tryGit(...args: string[]): string | null {
  try {
    return git(...args);
  } catch {
    return null;
  }
}

function blob(rev: string, file: string): string | null {
  return tryGit('rev-parse', '-q', '--verify', `${rev}:${file}`)?.trim() ?? null;
}

function show(rev: string, file: string): string | null {
  return tryGit('show', `${rev}:${file}`);
}

export function isShallow(): boolean {
  const shallow = tryGit('rev-parse', '--is-shallow-repository');
  if (shallow === null) throw new Error('not a git repository (or git is not installed).');
  return shallow.trim() === 'true';
}

// Fetch the full history if this is a shallow clone. The repository is public, so no credentials are needed.
export function ensureFullHistory(): boolean {
  if (!isShallow()) return true;
  try {
    git('fetch', '--quiet', '--unshallow');
  } catch (error) {
    console.warn(`post-updates: git fetch --unshallow failed: ${(error as Error).message.trim()}`);
    return false;
  }
  return !isShallow();
}

export function parseIgnoreList(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/#.*/, '').trim())
    .filter(Boolean)
    .map((sha) => {
      if (!/^[0-9a-f]{7,40}$/i.test(sha)) {
        throw new Error(`"${sha}" in ${IGNORE_FILE} is not a commit sha (7 to 40 hex characters).`);
      }
      return sha.toLowerCase();
    });
}

// Reduce post HTML to what a reader gets: text plus link and image targets, whitespace collapsed.
export function contentOf(html: string): string {
  html = html.replace(BLOCK, '');
  const attributes = [...html.matchAll(/\s\[?([\w.-]+)\]?\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
    .map(([, name, double, single]) => [name.toLowerCase().replace(/^attr\./, ''), double ?? single])
    .filter(([name]) => CONTENT_ATTRIBUTES.includes(name))
    .map(([name, value]) => `${name}=${value}`);
  const text = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    // Hand-written "Last updated" lines are metadata, not content.
    .replace(/<p class="last-updated">[\s\S]*?<\/p>/g, ' ')
    .replace(/<[^>]*>/g, ' ');
  return `${text}\n${attributes.join('\n')}`.replace(/\s+/g, ' ').trim();
}

// Paths like /blog/iou.webp in HTML, TypeScript or SCSS (quoted, in url(...), or in srcset).
export function blogUrlsIn(text: string): string[] {
  return [...new Set([...text.matchAll(/["'(\s,](\/blog\/[^"'()\s,]+\.\w+)/g)].map((match) => match[1]))];
}

// The registry is TypeScript with lazy imports, so read the two fields we need instead of executing it.
function readPosts(): { slug: string; date?: string }[] {
  const source = readFileSync(REGISTRY_FILE, 'utf8');
  return [...source.matchAll(/\{[^{}]*?slug:\s*'([^']+)'[^{}]*?\}/gs)].map((match) => ({
    slug: match[1],
    date: /date:\s*'([^']*)'/.exec(match[0])?.[1],
  }));
}

function postFile(slug: string, extension: string): string {
  return path.join(POSTS_DIR, slug, `${slug}.component.${extension}`);
}

// Images under src/app/assets/blog/ that the post's template, component or styles point at.
function assetsOf(slug: string): string[] {
  const sources = ['html', 'ts', 'scss']
    .map((extension) => postFile(slug, extension))
    .filter((file) => existsSync(file))
    .map((file) => readFileSync(file, 'utf8'));
  return blogUrlsIn(sources.join('\n')).map((url) => path.join(ASSETS_DIR, url));
}

// Newest-first, non-merge commits that touched `file`, following renames.
function commitsFor(file: string): Commit[] {
  const log = git('log', '--follow', '--no-merges', '--format=%x00%H%x09%cI%x09%P', '--name-status', '--', file);
  return log
    .split('\0')
    .filter(Boolean)
    .map((entry) => {
      const [header, ...rest] = entry.trim().split('\n');
      const [sha, date, parents = ''] = header.split('\t');
      const [status = '', ...paths] = (rest.find(Boolean) ?? '').split('\t');
      return {
        sha,
        date,
        parent: parents.split(' ')[0] || undefined,
        status,
        oldPath: paths[0],
        newPath: paths.at(-1)!,
      };
    });
}

function isMeaningful(commit: Commit, isHtml: boolean, ignored: string[]): boolean {
  if (ignored.some((prefix) => commit.sha.startsWith(prefix))) return false;
  // A root commit is the repository import, not an edit.
  if (!commit.parent) return false;
  if (commit.status.startsWith('A')) return true;
  const before: [string, string] = [commit.parent, commit.oldPath];
  const after: [string, string] = [commit.sha, commit.newPath];
  if (!isHtml) return blob(...before) !== blob(...after);
  const [old, current] = [show(...before), show(...after)];
  return old === null || current === null || contentOf(old) !== contentOf(current);
}

export function generatePostUpdates(): Record<string, PostUpdate> {
  const ignored = existsSync(IGNORE_FILE) ? parseIgnoreList(readFileSync(IGNORE_FILE, 'utf8')) : [];
  const updates: Record<string, PostUpdate> = {};
  for (const post of readPosts()) {
    if (!post.date || !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
      console.warn(`post-updates: "${post.slug}" has no valid YYYY-MM-DD date, skipping.`);
      continue;
    }

    const htmlPath = postFile(post.slug, 'html');
    if (!existsSync(htmlPath)) {
      console.warn(`post-updates: "${post.slug}" has no ${htmlPath}, skipping.`);
      continue;
    }

    const files = [{ file: htmlPath, isHtml: true }, ...assetsOf(post.slug).map((file) => ({ file, isHtml: false }))];
    const latest = files
      .map(({ file, isHtml }) => commitsFor(file).find((commit) => isMeaningful(commit, isHtml, ignored)))
      .filter((commit) => commit !== undefined)
      .reduce<Commit | undefined>((a, b) => (a && Date.parse(a.date) >= Date.parse(b.date) ? a : b), undefined);

    // Keep the committer's local calendar date: post dates are written the same way, without a timezone.
    // Both are YYYY-MM-DD, so string order is date order; an edit on the publish day does not count.
    const date = latest?.date.slice(0, 10);
    if (latest && date && post.date < date) updates[post.slug] = { sha: latest.sha, date };
  }
  return updates;
}

// Same markup and URL as the site footer's commit link.
export function renderBlock({ sha, date }: PostUpdate): string {
  const displayDate = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const short = sha.slice(0, 7);
  return (
    `  <!-- post-updated date=${date} sha=${sha} (written by post-updates.ts) -->\n` +
    `  <hr />\n` +
    `  <p class="last-updated">\n` +
    `    Last updated: <time class="dt-updated" datetime="${date}">${displayDate}</time> (<a\n` +
    `      class="shasum"\n` +
    `      href="https://git.elrant.team/irisnk/webbed-site/commit/${sha}"\n` +
    `      aria-label="commit ${short}"\n` +
    `      >${short}</a\n` +
    `    >)\n` +
    `  </p>\n` +
    `  <!-- /post-updated -->\n`
  );
}

// Replace the post's generated line, or remove it when `update` is undefined.
// Returns null when the post has no back link to put the line before.
export function applyBlock(html: string, update: PostUpdate | undefined): string | null {
  const stripped = html.replace(BLOCK, '');
  if (!update) return stripped;
  const anchor = BACK_LINK.exec(stripped);
  if (!anchor) return null;
  return stripped.slice(0, anchor.index) + renderBlock(update) + stripped.slice(anchor.index);
}

export function writePostUpdates(updates: Record<string, PostUpdate>): void {
  for (const { slug } of readPosts()) {
    const file = postFile(slug, 'html');
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    const next = applyBlock(html, updates[slug]);
    if (next === null) {
      console.warn(`post-updates: ${file} has no back link to put the "last updated" line before, skipping.`);
    } else if (next !== html) {
      writeFileSync(file, next, 'utf8');
    }
  }
}

// Deploy step. Without the full history the dates would be wrong, so then write nothing.
export function updatePostUpdatesForDeploy(): void {
  if (!ensureFullHistory()) {
    console.warn('post-updates: no full git history, so posts get no "last updated" line in this build.');
    return;
  }
  const updates = generatePostUpdates();
  writePostUpdates(updates);
  console.log(`post-updates: wrote "last updated" lines for ${Object.keys(updates).join(', ') || 'no posts'}`);
}

// CLI, to preview locally: `node post-updates.ts` writes the lines, `--clean` removes them.
if (process.argv[1]?.endsWith('post-updates.ts')) {
  try {
    if (process.argv.includes('--clean')) writePostUpdates({});
    else updatePostUpdatesForDeploy();
  } catch (error) {
    console.error(`post-updates: ${(error as Error).message}`);
    process.exit(1);
  }
}
