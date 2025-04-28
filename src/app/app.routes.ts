import { Routes, CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './features/home/home.component';
import { inject } from '@angular/core'; 
import { AuthService } from './auth/auth.service'; 
import { LoginComponent } from './auth/components/login/login.component';
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
          import('./people/components/document-list/document-list.component').then(
            (m) => m.DocumentListComponent
          ),
      },
      {
        path: 'EmployeeDetails',
        loadComponent: () =>
          import('./people/components/employee-details/employee-details.component').then(
            (m) => m.EmployeeDetailsComponent
          ),
      },
      {
        path: 'leaveRequest',
        loadComponent: () =>
          import('./people/components/leave-request/leave-request.component').then(
            (m) => m.LeaveRequestComponent
          ),
      },
    ],
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/components/login/login.component').then((m) => m.LoginComponent),
  },
  
];