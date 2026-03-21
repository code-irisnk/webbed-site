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
    slug: 'iou',
    title: 'U - underscores',
    date: 'March 20, 2026',
    description: 'A review of "U" by underscores.',
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
