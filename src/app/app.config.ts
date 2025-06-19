import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthModule } from './features/auth/auth.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environment/environment'; 
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
// import Material from '@primeng/themes/material';
import Aura from '@primeng/themes/aura';
// import Lara from '@primeng/themes/lara';
import { errorHandlingInterceptor } from './core/interceptors/error-handling.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([errorHandlingInterceptor])), 
    AuthModule,
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: Aura,
            options: {
              prefix: 'p',
              darkModeSelector: '.my-app-dark',
              cssLayer: false,
              ripple: true
            },
        }
    })
  ],
};
