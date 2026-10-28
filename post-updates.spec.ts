/** @jest-environment node */
import { execFileSync } from 'child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  applyBlock,
  blogUrlsIn,
  contentOf,
  generatePostUpdates,
  parseIgnoreList,
  renderBlock,
  updatePostUpdatesForDeploy,
} from './post-updates';

describe('contentOf', () => {
  it('ignores formatting and markup-only changes', () => {
    const before = '<p class="post-date dt-published">March 20, 2026</p>\n<img ngSrc="/blog/iou.png" width="640" />';
    const after = `<p class="post-date">
      <time class="dt-published" datetime="2026-03-20">March 20, 2026</time>
    </p>
    <img ngSrc="/blog/iou.png" priority width="640" height="336" />`;
    expect(contentOf(after)).toBe(contentOf(before));
  });

  it('counts text, link and image changes', () => {
    const base = contentOf('<p>Hello <a href="/a">there</a></p><img src="/blog/a.webp" alt="A" />');
    expect(contentOf('<p>Hello <a href="/a">here</a></p><img src="/blog/a.webp" alt="A" />')).not.toBe(base);
    expect(contentOf('<p>Hello <a href="/b">there</a></p><img src="/blog/a.webp" alt="A" />')).not.toBe(base);
    expect(contentOf('<p>Hello <a href="/a">there</a></p><img src="/blog/b.webp" alt="A" />')).not.toBe(base);
    expect(contentOf('<p>Hello <a href="/a">there</a></p><img src="/blog/a.webp" alt="B" />')).not.toBe(base);
  });

  it('counts Angular bindings and single-quoted attributes', () => {
    expect(contentOf(`<img [src]="'/blog/a.webp'" />`)).not.toBe(contentOf(`<img [src]="'/blog/b.webp'" />`));
    expect(contentOf('<a [attr.href]="url1">x</a>')).not.toBe(contentOf('<a [attr.href]="url2">x</a>'));
    expect(contentOf("<a href='/a'>x</a>")).not.toBe(contentOf("<a href='/b'>x</a>"));
    expect(contentOf('<a routerLink="/a">x</a>')).not.toBe(contentOf('<a routerLink="/b">x</a>'));
    expect(contentOf(`<img [class]="'a'" />`)).toBe(contentOf(`<img [class]="'b'" />`));
  });

  it('ignores hand-written and generated "Last updated" lines', () => {
    const post = '<p>Post</p>\n  <br />\n  <br />\n  <a class="back" routerLink="/blog">back</a>\n';
    expect(contentOf('<p>Post</p><p class="last-updated"> Last updated: <time>Oct 21</time> </p>')).toBe(
      contentOf('<p>Post</p>'),
    );
    expect(contentOf(applyBlock(post, { sha: 'be78e1f80b4b9d2c8af9f65409aa8cb18b5e2da1', date: '2026-10-21' })!)).toBe(
      contentOf(post),
    );
  });
});

describe('blogUrlsIn', () => {
  it('finds /blog/ paths in HTML, TypeScript and SCSS', () => {
    const text = [
      '<source srcset="/blog/a.webp 1x, /blog/a2.webp 2x" />',
      "cover = '/blog/b.png';",
      'background: url(/blog/c.jpg);',
      'ogImage: "https://irisnk.me/blog/d.webp"',
    ].join('\n');
    expect(blogUrlsIn(text)).toEqual(['/blog/a.webp', '/blog/a2.webp', '/blog/b.png', '/blog/c.jpg']);
  });
});

describe('parseIgnoreList', () => {
  it('reads shas and skips comments and blank lines', () => {
    expect(parseIgnoreList('# header\n\nBE78E1F  # why\n630057b501ea5f055b31678255e339cfd425867e\n')).toEqual([
      'be78e1f',
      '630057b501ea5f055b31678255e339cfd425867e',
    ]);
  });

  it('rejects lines that are not shas', () => {
    expect(() => parseIgnoreList('abc\n')).toThrow('not a commit sha');
    expect(() => parseIgnoreList('not-a-sha-at-all\n')).toThrow('not a commit sha');
  });
});

describe('applyBlock', () => {
  const post = '<p>Post</p>\n  <br />\n  <br />\n  <a class="back" routerLink="/blog">&lt;- back</a>\n';
  const update = { sha: 'be78e1f80b4b9d2c8af9f65409aa8cb18b5e2da1', date: '2026-10-21' };

  it('puts the line before the back link, with the footer link style', () => {
    const html = applyBlock(post, update)!;
    expect(html.indexOf('class="last-updated"')).toBeLessThan(html.indexOf('class="back"'));
    expect(html).toContain('<time class="dt-updated" datetime="2026-10-21">October 21, 2026</time>');
    expect(html).toContain(
      'href="https://git.elrant.team/irisnk/webbed-site/commit/be78e1f80b4b9d2c8af9f65409aa8cb18b5e2da1"',
    );
    expect(html).toContain('aria-label="commit be78e1f"');
    expect(html).toContain('>be78e1f</a');
  });

  it('replaces or removes an existing line', () => {
    const html = applyBlock(post, update)!;
    expect(applyBlock(html, update)).toBe(html);
    expect(applyBlock(html, undefined)).toBe(post);
  });

  it('finds the back link with other whitespace', () => {
    const html = applyBlock('<p>Post</p>\n    <br/>\n\n    <br />  <a class="back" routerLink="/blog">b</a>', update);
    expect(html).toContain(renderBlock(update));
  });

  it('returns null without a back link', () => {
    expect(applyBlock('<p>Post</p>', update)).toBeNull();
  });
});

// Runs the real git commands against a small repository with the same layout as this one.
describe('git history', () => {
  const cwd = process.cwd();
  let root: string;
  const blog = 'src/app/pages/blog';
  const html = `${blog}/posts/a/a.component.html`;

  function git(dir: string, ...args: string[]) {
    return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  }

  function commit(dir: string, message: string, date: string) {
    git(dir, 'add', '-A');
    execFileSync('git', ['commit', '-q', '-m', message], {
      cwd: dir,
      env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
    });
    return git(dir, 'rev-parse', 'HEAD');
  }

  function post(text: string) {
    return `<article>\n  <p>${text}</p>\n  <br />\n  <br />\n  <a class="back" routerLink="/blog">back</a>\n</article>\n`;
  }

  beforeAll(() => {
    root = mkdtempSync(join(tmpdir(), 'post-updates-'));
    const origin = join(root, 'origin');
    mkdirSync(join(origin, `${blog}/posts/a`), { recursive: true });
    git(origin, 'init', '-q');
    git(origin, 'config', 'user.email', 'test@example.com');
    git(origin, 'config', 'user.name', 'test');
    writeFileSync(join(origin, `${blog}/blog-registry.ts`), "[{ slug: 'a', date: '2026-01-10' }]\n");
    writeFileSync(join(origin, html), post('First.'));
    commit(origin, 'import', '2026-01-01T12:00:00+01:00');
    writeFileSync(join(origin, html), post('First, edited.'));
    commit(origin, 'edit', '2026-02-01T23:30:00+01:00');
    writeFileSync(join(origin, html), post('First,   edited.'));
    commit(origin, 'format only', '2026-03-01T12:00:00+01:00');
  });

  afterEach(() => process.chdir(cwd));
  afterAll(() => rmSync(root, { recursive: true, force: true }));

  function shallowClone(name: string) {
    const dir = join(root, name);
    execFileSync('git', ['clone', '-q', '--depth', '1', `file://${join(root, 'origin')}`, dir]);
    return dir;
  }

  it('uses the latest meaningful commit and its local date', () => {
    process.chdir(join(root, 'origin'));
    const edit = git('.', 'rev-parse', 'HEAD~1');
    expect(generatePostUpdates()).toEqual({ a: { sha: edit, date: '2026-02-01' } });
  });

  it('unshallows a shallow clone, then writes the line', () => {
    const dir = shallowClone('ok');
    process.chdir(dir);
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    updatePostUpdatesForDeploy();
    log.mockRestore();
    expect(git(dir, 'rev-parse', '--is-shallow-repository')).toBe('false');
    expect(readFileSync(html, 'utf8')).toContain(`commit ${git(dir, 'rev-parse', 'HEAD~1').slice(0, 7)}`);
  });

  it('writes no line, and never the deployed commit, when the unshallow fails', () => {
    const dir = shallowClone('broken');
    git(dir, 'remote', 'set-url', 'origin', join(root, 'does-not-exist'));
    process.chdir(dir);
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    updatePostUpdatesForDeploy();
    warn.mockRestore();
    expect(readFileSync(html, 'utf8')).toBe(post('First,   edited.'));
  });
});
