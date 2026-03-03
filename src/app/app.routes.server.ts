import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './pages/blog/blog-registry';

export const serverRoutes: ServerRoute[] = [
  ...BLOG_POSTS.map(
    (post): ServerRoute => ({
      path: `blog/${post.slug}`,
      renderMode: RenderMode.Prerender,
    }),
  ),

  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
