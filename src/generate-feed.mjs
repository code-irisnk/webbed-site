import RSS from 'rss';
import * as fs from 'fs';

import { BLOG_POSTS } from './app/pages/blog/blog-registry.ts';

const xmlFilename = 'src/app/assets/blog/feed.xml';
const jsonFilename = 'src/app/assets/blog/feed.json';
const today = new Date();

// RSS feed
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
fs.writeFileSync(xmlFilename, xml);

// JSON Feed
function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? undefined : date.toISOString();
}

const jsonFeed = {
  version: 'https://jsonfeed.org/version/1',
  title: 'irisnk.me',
  home_page_url: 'https://irisnk.me',
  feed_url: 'https://irisnk.me/blog/feed.json',
  description: 'A nerd talks about music, computers and stuff.',
  user_comment: "JSON Feed for Iris Nkrichronos' blog",
  icon: 'https://irisnk.me/favicon/android-chrome-192x192.png',
  author: {
    name: 'Iris Nkrichronos',
    url: 'https://irisnk.me',
    email: 'the@irisnk.me',
  },
  items: BLOG_POSTS.map((post) => {
    const item = {
      id: `https://irisnk.me/blog/${post.slug}`,
      url: `https://irisnk.me/blog/${post.slug}`,
      title: post.title,
      summary: post.description,
      content_text: post.description,
      date_published: parseDate(post.date),
    };

    if (post.ogImage) {
      item.image = post.ogImage;
    }

    return item;
  }),
  expired: false,
  authors: [
    {
      name: 'Iris Nkrichronos',
      url: 'https://irisnk.me',
      email: 'the@irisnk.me',
    },
  ],
  items_count: BLOG_POSTS.length,
  last_updated: today.toISOString(),
};

fs.writeFileSync(jsonFilename, JSON.stringify(jsonFeed, null, 2));

// Atom feed
const atomFilename = 'src/app/assets/blog/atom.xml';
const atomEntries = BLOG_POSTS.map((post) => {
  const updated = parseDate(post.date) || today.toISOString();
  const title = `<![CDATA[${post.title}]]>`;
  const summary = `<![CDATA[${post.description}]]>`;
  const enclosure = post.ogImage ? `<link rel="enclosure" type="image/jpeg" href="${post.ogImage}"/>` : '';
  return [
    '  <entry>',
    `    <title>${title}</title>`,
    `    <link href="https://irisnk.me/blog/${post.slug}"/>`,
    `    <id>https://irisnk.me/blog/${post.slug}</id>`,
    `    <updated>${updated}</updated>`,
    `    <summary>${summary}</summary>`,
    enclosure,
    '  </entry>',
  ].filter(Boolean).join('\n');
}).join('\n');

const atom = `<?xml version="1.0" encoding="utf-8"?>\n` +
  `<feed xmlns="http://www.w3.org/2005/Atom">\n` +
  `  <title>irisnk.me</title>\n` +
  `  <link href="https://irisnk.me/blog/atom.xml" rel="self"/>\n` +
  `  <link href="https://irisnk.me/"/>\n` +
  `  <updated>${today.toISOString()}</updated>\n` +
  `  <id>https://irisnk.me/</id>\n` +
  `  <author><name>Iris Nkrichronos</name><email>the@irisnk.me</email></author>\n` +
  `${atomEntries}\n` +
  `</feed>`;

fs.writeFileSync(atomFilename, atom);
