import { Routes, CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { inject } from '@angular/core'; 
import { AuthService } from './auth/auth.service'; 

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
    path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard],
    children: [
      {
        path: 'Documents',
        loadComponent: () => import('./people/components/document-list/document-list.component').then(m => m.DocumentListComponent),
      },
      {
        path: 'EmployeeDetails',
        loadComponent: () => import('./people/components/employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent),
      },
      {
        path: 'leaveRequest',
        loadComponent: () => import('./people/components/leave-request/leave-request.component').then(m => m.LeaveRequestComponent),
      }
    ]
  },
  
];