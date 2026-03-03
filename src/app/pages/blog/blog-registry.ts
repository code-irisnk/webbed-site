import { Type } from '@angular/core';

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  loadComponent: () => Promise<Type<unknown>>;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'hello-world',
    title: 'Hello, World!',
    date: 'March 3, 2026',
    description: 'First post. You know how it goes.',
    loadComponent: () => import('./posts/hello-world/hello-world.component').then((m) => m.HelloWorldPostComponent),
  },
];
