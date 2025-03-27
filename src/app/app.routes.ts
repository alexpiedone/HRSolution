import { Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { authGuard } from './auth/auth.guard'; 


export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule) },
    { path: 'people', loadChildren: () => import('./people/people.module').then(m => m.PeopleModule), canActivate: [authGuard] }, // Adaugă AuthGuard
];
