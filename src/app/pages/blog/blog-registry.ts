import { Type } from '@angular/core';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string; // ISO 8601 date (YYYY-MM-DD)
  description: string;
  ogImage?: string; // Optional absolute URL. Falls back to site pfp if omitted.
  loadComponent: () => Promise<Type<unknown>>;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'marrow',
    title: 'marroW - brakence',
    date: '2026-10-26',
    description: 'Four years later, brakence digs into himself.',
    loadComponent: () => import('./posts/marrow/marrow.component').then((m) => m.MarrowPostComponent),
  },
  {
    slug: 'on-poly-stigma',
    title: 'On Poly Stigma',
    date: '2026-09-13',
    description: 'On polyamory, family, and the inheritance of stigma.',
    ogImage: 'https://irisnk.me/blog/propaganda.webp',
    loadComponent: () =>
      import('./posts/on-poly-stigma/on-poly-stigma.component').then((m) => m.OnPolyStigmaPostComponent),
  },
  {
    slug: 'because-the-internet',
    title: 'because the internet',
    date: '2026-09-05',
    description: 'too much // sensitive topics',
    loadComponent: () =>
      import('./posts/because-the-internet/because-the-internet.component').then(
        (m) => m.BecauseTheInternetPostComponent,
      ),
  },
  {
    slug: 'music-art',
    title: 'Music, art',
    date: '2026-09-03',
    description: 'Space intentionally left not blank.',
    loadComponent: () => import('./posts/music-art/music-art.component').then((m) => m.MusicArtPostComponent),
  },
  {
    slug: 'clod',
    title: 'The Claudening',
    date: '2026-08-23',
    description: "Where's your head at?",
    loadComponent: () => import('./posts/clod/clod.component').then((m) => m.ClodPostComponent),
  },
  {
    slug: 'casino',
    title: 'Ca$ino - Baby Keem',
    date: '2026-04-23',
    description: "Back-to-back hits held back by Keem's weak singing.",
    ogImage: 'https://irisnk.me/blog/casino.webp',
    loadComponent: () => import('./posts/casino/casino.component').then((m) => m.CasinoPostComponent),
  },
  {
    slug: 'bully',
    title: 'BULLY - Kanye West',
    date: '2026-04-03',
    description: "Kanye's pathetic attempt at a comeback.",
    loadComponent: () => import('./posts/bully/bully.component').then((m) => m.BullyPostComponent),
  },
  {
    slug: 'clarence-clarity',
    title: 'Clarence Clarity',
    date: '2026-04-03',
    description: 'One of the best experimental pop artists.',
    loadComponent: () =>
      import('./posts/clarence-clarity/clarence-clarity.component').then((m) => m.ClarenceClarityPostComponent),
  },
  {
    slug: 'iou',
    title: 'U - underscores',
    date: '2026-03-20',
    description: 'A review of "U" by underscores.',
    ogImage: 'https://irisnk.me/blog/iou.webp',
    loadComponent: () => import('./posts/iou/iou.component').then((m) => m.IOUPostComponent),
  },
  {
    slug: 'i-like-music-2025',
    title: 'I Like Music (2025)',
    date: '2026-03-04',
    description: 'A recap of my favorite music of 2025!',
    ogImage: 'https://irisnk.me/blog/music.webp',
    loadComponent: () =>
      import('./posts/i-like-music-2025/i-like-music-2025.component').then((m) => m.ILikeMusic2025PostComponent),
  },
  {
    slug: 'hello-world',
    title: 'Hello, World!',
    date: '2026-03-03',
    description: 'First post. You know how it goes.',
    loadComponent: () => import('./posts/hello-world/hello-world.component').then((m) => m.HelloWorldPostComponent),
  },
  {
    slug: 'the-end-poem',
    title: 'The End Poem',
    date: '2023-06-12',
    description: 'From a block game but it means something anyways.',
    ogImage: 'https://irisnk.me/blog/the-end-poem.webp',
    loadComponent: () => import('./posts/the-end-poem/the-end-poem.component').then((m) => m.TheEndPoemPostComponent),
  },
];
