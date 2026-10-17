import { BlogPostMeta } from '../pages/blog/blog-registry';

const SITE_URL = 'https://irisnk.me';
const DEFAULT_IMAGE = `${SITE_URL}/index/pfp.png`;

export type JsonLd = Record<string, unknown>;

export const PERSON_JSON_LD: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Iris Nkrichronos',
  url: SITE_URL,
  sameAs: [
    'https://github.com/code-irisnk',
    'https://nkrichronos.bandcamp.com',
    'https://git.elrant.team/irisnk',
    'https://open.spotify.com/artist/3w0jrGnJZGGscmcu0DoLR5',
  ],
  description: 'Indie artist, dev, and soul',
  jobTitle: 'Developer & Artist',
  image: DEFAULT_IMAGE,
};

export const blogPostingJsonLd = (post: BlogPostMeta): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.description,
  datePublished: post.date,
  dateModified: post.date,
  image: post.ogImage ?? DEFAULT_IMAGE,
  url: `${SITE_URL}/blog/${post.slug}/`,
  mainEntityOfPage: `${SITE_URL}/blog/${post.slug}/`,
  author: { '@type': 'Person', name: 'Iris Nkrichronos', url: SITE_URL },
});
