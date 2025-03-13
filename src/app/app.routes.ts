import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'git', loadComponent: () => import('./pages/git/git.component').then(m => m.GitComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'donate', loadComponent: () => import('./pages/donate/donate.component').then(m => m.DonateComponent)},
  { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'socials', loadComponent: () => import('./pages/socials/socials.component').then(m => m.SocialsComponent) },
  { path: '**', redirectTo: '' }
];
