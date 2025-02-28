import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'git', loadComponent: () => import('./pages/git/git.component').then(m => m.GitComponent) },
  { path: '**', redirectTo: '' }
];
