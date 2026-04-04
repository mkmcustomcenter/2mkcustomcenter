import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent) },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];