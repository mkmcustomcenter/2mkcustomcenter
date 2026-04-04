import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent) },
  { path: '2mkdesk', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: '2mkreset', loadComponent: () => import('./components/password-reset/password-reset.component').then(m => m.PasswordResetComponent) },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];