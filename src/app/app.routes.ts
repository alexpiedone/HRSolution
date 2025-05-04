import { Routes, CanActivateFn, Router } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { inject } from '@angular/core'; 
import { AuthService } from './features/auth/auth.service';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
const redirectBasedOnAuth: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/home']);
    return false; 
  } else {
    router.navigate(['/auth/login']);
    return false; 
  }
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent, 
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'Documents',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'EmployeeDetails',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'leaveRequest',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'timesheet',
        loadComponent: () =>
          import('./features/timesheet/timesheet.component').then(
            (m) => m.TimesheetComponent
          ),
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  
];