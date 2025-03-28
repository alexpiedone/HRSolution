import { Routes, CanActivateFn, Router } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/components/login/login.component'; 
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
        path: '',
        redirectTo: () => {
          const authService = inject(AuthService);
          return authService.isAuthenticated() ? '/home' : '/auth/login';
        },
        pathMatch: 'full'
      },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] }, // Pagina home (protejată)
  { path: 'auth', loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule) },
  { path: 'people', loadChildren: () => import('./people/people.module').then(m => m.PeopleModule), canActivate: [authGuard] },
];