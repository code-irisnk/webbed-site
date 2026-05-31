import { Feed } from 'feed';
import * as fs from 'fs';
import sanitizeHtml from 'sanitize-html';

import { BLOG_POSTS } from './app/pages/blog/blog-registry.ts';
// Files and imports in JS are WEIRD man.
const xmlFilename = 'src/app/assets/blog/feed.xml';
const jsonFilename = 'src/app/assets/blog/feed.json';
const atomFilename = 'src/app/assets/blog/atom.xml';
const today = new Date();

const siteUrl = 'https://irisnk.me';

const normalizeRelativeUrl = (url) => (url.startsWith('/') ? `${siteUrl}${url}` : url);

const sanitizeFeedHtml = (html, postUrl) => {
  // Remove Angular specific junk
  const normalized = html
    .replace(/routerLink="([^"]+)"/g, (_, link) => `href="${normalizeRelativeUrl(link)}"`)
    .replace(/\[routerLink\]="\[\]" fragment="([^"]+)"/g, (_, fragment) => `href="${postUrl}#${fragment}"`)
    .replace(/href="\/([^"]+)"/g, `href="${siteUrl}/$1"`)
    .replace(/srcset="\/([^"]+)"/g, `srcset="${siteUrl}/$1"`)
    .replace(/ngSrc="\/([^"]+)"/g, `src="${siteUrl}/$1"`)
    .replace(/src="\/([^"]+)"/g, `src="${siteUrl}/$1"`);

  // cool library cleans the rest up for me
  return sanitizeHtml(normalized, {
    allowedTags: [
      'a', 'abbr', 'b', 'blockquote', 'br', 'cite', 'code', 'div', 'em', 'figcaption', 'figure',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'q', 'section', 'span',
      'strong', 'ul', 'article', 'header', 'footer', 'pre', 'source'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'id'],
      source: ['srcset', 'type'],
      '*': ['id', 'aria-labelledby', 'aria-label']
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesAppliedToAttributes: ['href', 'src', 'srcset'],
    allowProtocolRelative: false,
  });
};

const feed = new Feed({
  title: 'irisnk.me',
  description: 'A nerd talks about music, computers and stuff.',
  id: siteUrl + '/',
  link: siteUrl + '/',
  language: 'en',
  image: siteUrl + '/favicon/android-chrome-192x192.png',
  favicon: siteUrl + '/favicon/android-chrome-192x192.png',
  copyright: `${today.getFullYear()} Iris Nkrichronos`,
  updated: today,
  generator: 'git.elrant.team/irisnk/webbed-site',
  feedLinks: {
    rss: `${siteUrl}/blog/feed.xml`,
    atom: `${siteUrl}/blog/atom.xml`,
    json: `${siteUrl}/blog/feed.json`,
  },
  author: {
    name: 'Iris Nkrichronos',
    email: 'the@irisnk.me',
    link: siteUrl,
  },
});

for (const post of BLOG_POSTS) {
  const url = `${siteUrl}/blog/${post.slug}`;
  const postDate = new Date(post.date);
  const htmlPath = `src/app/pages/blog/posts/${post.slug}/${post.slug}.component.html`;
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  const item = {
    title: post.title,
    id: url,
    link: url,
    description: post.description,
    content: sanitizeFeedHtml(htmlContent, url),
    date: postDate,
    published: postDate,
    author: [
      {
        name: 'Iris Nkrichronos',
        email: 'the@irisnk.me',
        link: siteUrl,
      },
    ],
  };

  if (post.ogImage) {
    item.image = post.ogImage;
  }

  feed.addItem(item);
}


fs.writeFileSync(xmlFilename, feed.rss2());
fs.writeFileSync(jsonFilename, feed.json1());
fs.writeFileSync(atomFilename, feed.atom1());
