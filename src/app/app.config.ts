import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environment/environment'; 
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(), AuthModule,
    provideAuth(() => getAuth()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig))
  ],
};
