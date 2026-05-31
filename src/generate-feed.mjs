import { Feed } from 'feed';
import * as fs from 'fs';

import { BLOG_POSTS } from './app/pages/blog/blog-registry.ts';
// Files and imports in JS are WEIRD man.
const xmlFilename = 'src/app/assets/blog/feed.xml';
const jsonFilename = 'src/app/assets/blog/feed.json';
const atomFilename = 'src/app/assets/blog/atom.xml';
const today = new Date();

const siteUrl = 'https://irisnk.me';

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

  const item = {
    title: post.title,
    id: url,
    link: url,
    description: post.description,
    content: post.description,
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
