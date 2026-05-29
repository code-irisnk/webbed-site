import RSS from 'rss';
import * as fs from 'fs';

import { BLOG_POSTS } from './app/pages/blog/blog-registry.ts';

const filename = 'src/app/assets/blog/feed.xml';
const today = new Date();

const feed = new RSS({
  title: 'irisnk.me',
  description: 'A nerd talks about music, computers and stuff.',
  feed_url: 'https://irisnk.me/blog/feed.xml',
  site_url: 'https://irisnk.me',
  image_url: 'https://irisnk.me/favicon/android-chrome-192x192.png',
  generator: 'git.elrant.team/irisnk/webbed-site',
  managing_editor: 'Iris Nkrichronos',
  webMaster: 'the@irisnk.me (Iris Nkrichronos)',
  copyright: today.getFullYear() + ' Iris Nkrichronos',
  language: 'en',
  categories: ['music', 'programming', 'personal'],
  pubDate: today.toISOString(),
  ttl: '120', // I do not post often
});

for (const post of BLOG_POSTS) {
  const item = {
    title: post.title,
    description: post.description,
    url: `https://irisnk.me/blog/${post.slug}`,
    guid: post.slug,
    date: post.date,
  };

  if (post.ogImage) {
    item.enclosure = {
      url: post.ogImage,
      type: 'image/jpeg',
    };
  }

  feed.item(item);
}

const xml = feed.xml();
fs.writeFileSync(filename, xml);
