import { Routes } from '@angular/router';
import { BLOG_POSTS } from './pages/blog/blog-registry';
import { ogResolver } from './services/og.resolver';
import { PERSON_JSON_LD, blogPostingJsonLd } from './services/structured-data';

export const routes: Routes = [
  {
    path: '',
    title: 'Iris Nkrichronos',
    data: { jsonLd: PERSON_JSON_LD },
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'git',
    title: 'Git',
    loadComponent: () => import('./pages/git/git.component').then((m) => m.GitComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'keys',
    title: 'Keys',
    loadComponent: () => import('./pages/keys/keys.component').then((m) => m.KeysComponent),
  },
  {
    path: 'blog',
    title: 'Blog',
    loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogComponent),
  },
  ...BLOG_POSTS.map((post) => ({
    path: `blog/${post.slug}`,
    title: `${post.title} - a post by Iris`,
    loadComponent: post.loadComponent,
    data: { jsonLd: blogPostingJsonLd(post) },
    resolve: { og: ogResolver(post) },
  })),

  {
    path: 'privacy',
    title: 'Privacy',
    data: { noindex: true, unlisted: true },
    loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
  },

  {
    path: '404',
    title: 'Page not found',
    data: { noindex: true, unlisted: true },
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },

  {
    path: '**',
    title: 'Page not found',
    data: { noindex: true },
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
