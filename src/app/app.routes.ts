import { Routes } from '@angular/router';
import { BLOG_POSTS } from './pages/blog/blog-registry';
import { ogResolver } from './services/og.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'git',
    loadComponent: () => import('./pages/git/git.component').then((m) => m.GitComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'donate',
    loadComponent: () => import('./pages/donate/donate.component').then((m) => m.DonateComponent),
  },
  {
    path: 'socials',
    loadComponent: () => import('./pages/socials/socials.component').then((m) => m.SocialsComponent),
  },
  {
    path: 'keys',
    loadComponent: () => import('./pages/keys/keys.component').then((m) => m.KeysComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogComponent),
  },
  ...BLOG_POSTS.map((post) => ({
    path: `blog/${post.slug}`,
    loadComponent: post.loadComponent,
    resolve: { og: ogResolver(post) },
  })),

  { path: '**', redirectTo: '' },
];
