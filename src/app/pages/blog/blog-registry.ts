export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: 'hello-world',
    title: 'Hello, World!',
    date: 'March 3, 2026',
    description: 'First post. You know how it goes.',
  },
];

export const BLOG_POST_LOADERS: Record<string, () => Promise<unknown>> = {
  'hello-world': () => import('./posts/hello-world/hello-world.component').then((m) => m.HelloWorldPostComponent),
};
