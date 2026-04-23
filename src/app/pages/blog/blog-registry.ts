import { Type } from '@angular/core';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  ogImage?: string; // Optional absolute URL. Falls back to site pfp if omitted.
  loadComponent: () => Promise<Type<unknown>>;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'casino',
    title: 'Ca$ino - Baby Keem',
    date: 'April 23, 2026',
    description: "Back-to-back hits held back by Keem's weak singing.",
    ogImage: 'https://irisnk.me/blog/casino.webp',
    loadComponent: () => import('./posts/casino/casino.component').then((m) => m.CasinoPostComponent),
  },
  {
    slug: 'bully',
    title: 'BULLY - Kanye West',
    date: 'April 3, 2026',
    description: "Kanye's pathetic attempt at a comeback.",
    loadComponent: () => import('./posts/bully/bully.component').then((m) => m.BullyPostComponent),
  },
  {
    slug: 'clarence-clarity',
    title: 'Clarence Clarity',
    date: 'April 3, 2026',
    description: 'One of the best experimental pop artists.',
    loadComponent: () =>
      import('./posts/clarence-clarity/clarence-clarity.component').then((m) => m.ClarenceClarityPostComponent),
  },
  {
    slug: 'iou',
    title: 'U - underscores',
    date: 'March 20, 2026',
    description: 'A review of "U" by underscores.',
    ogImage: 'https://irisnk.me/blog/iou.webp',
    loadComponent: () => import('./posts/iou/iou.component').then((m) => m.IOUPostComponent),
  },
  {
    slug: 'i-like-music-2025',
    title: 'I Like Music (2025)',
    date: 'March 4, 2026',
    description: 'A recap of my favorite music of 2025!',
    ogImage: 'https://irisnk.me/blog/music.webp',
    loadComponent: () =>
      import('./posts/i-like-music-2025/i-like-music-2025.component').then((m) => m.ILikeMusic2025PostComponent),
  },
  {
    slug: 'hello-world',
    title: 'Hello, World!',
    date: 'March 3, 2026',
    description: 'First post. You know how it goes.',
    loadComponent: () => import('./posts/hello-world/hello-world.component').then((m) => m.HelloWorldPostComponent),
  },
  {
    slug: 'the-end-poem',
    title: 'The End Poem',
    date: 'June 12, 2023',
    description: 'From a block game but it means something anyways.',
    loadComponent: () => import('./posts/the-end-poem/the-end-poem.component').then((m) => m.TheEndPoemPostComponent),
  },
];
