import { Routes, CanActivateFn, Router } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { inject } from '@angular/core';
import { AuthService } from './features/auth/auth.service';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import path from 'path';


export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'Documents',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'user-overview',
        loadComponent: () =>
          import('./features/users/user-overview/user-overview.component').then(
            (m) => m.UserOverviewComponent
          ),
      },
      {
        path: 'leaveRequest',
        loadComponent: () =>
          import('./features/requests/leaverequest/leaverequest.component').then(
            (m) => m.LeaverequestComponent
          ),
      },
      {
        path: 'timesheet',
        loadComponent: () =>
          import('./features/timesheet/timesheet.component').then(
            (m) => m.TimesheetComponent
          ),
      }
    ],
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
