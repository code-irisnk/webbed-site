# Blog

So. Welcome back!

To write a blog post, make a subdir in `src/app/pages/blog/posts` with the slug of your post.
Then add a component in there. This is your blog post, so you can write whatever you want in the HTML.
You can also add styles in the component's SCSS file.

Finally, and add an entry to the `BLOG_POSTS` array in `blog-registry.ts`. You can use the existing posts as examples.

Do not write a "Last updated" line by hand. At deploy time, `post-updates.ts` writes one into the template, before the
back link, when a commit after the post's `date` changed the post. The line is plain markup, so the client gets no extra
code for it.

- `pnpm run deploy` runs `git fetch --unshallow` (Cloudflare Pages clones shallow) and then writes the lines from the
  full history. Like the commit sha in the environment files, the lines are not committed. They exist only in the build.
  If the unshallow fails, the build continues, and no post gets a line.
- `pnpm build` and `pnpm dev` do not write the lines. To preview them, run `pnpm post-updates` (Node 22.18 or later),
  and `pnpm post-updates --clean` to remove them again.
- When an automatic rule gets a commit wrong, add its sha to `post-updates-ignore.txt`.

What counts as a change to a post:

- A change to the text of `<slug>.component.html`, or to an `alt`, `title`, `src`, `ngSrc`, `srcset`, `href` or
  `routerLink` value. This includes Angular bindings such as `[src]="..."`, but only their expression text, not the
  value they produce.
- A change to an image file under `src/app/assets/blog/` whose `/blog/...` path is in the post's `.html`, `.ts` or
  `.scss`. Images found in other ways (for example, a path built from parts in code) are not detected.

What does not count: merge commits, the initial import (`88042c1`), formatting and other markup-only changes, and changes
to the post's `.ts` and `.scss` files themselves.

-- with love, Iris.
