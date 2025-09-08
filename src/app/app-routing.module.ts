import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EventsComponent } from './pages/events/events.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { SitesComponent } from './pages/sites/sites.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'events', loadComponent: () => import('./pages/events/events.component').then(m => m.EventsComponent) },
  { path: 'groups', loadComponent: () => import('./pages/groups/groups.component').then(m => m.GroupsComponent) },
  { path: 'employees', loadComponent: () => import('./pages/employees/employees.component').then(m => m.EmployeesComponent) },
  { path: 'sites', loadComponent: () => import('./pages/sites/sites.component').then(m => m.SitesComponent) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
