import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private _error$ = new Subject<string>();
  // private _errorsignal = signal<string | null>(null);  
  error$ = this._error$.asObservable();
  // errorsignal = this._errorsignal.asReadonly();  

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'A apărut o eroare necunoscută!';
    console.log('ErrorService: handleError', error);
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Eroare client: ${error.error.message}`;
      console.error('Client-side error:', error.error);
    } else {
      if (error.status === 0) {
        errorMessage = 'Nu se poate realiza conexiunea cu serverul.';
      } else if (error.status === 404) {
        errorMessage = 'Resursa solicitată nu a fost găsită.';
      } else if (error.status === 500) {
        errorMessage = 'Serverul a întâmpinat o problemă. Încearcă mai târziu.';
      } else {
        errorMessage = `Eroare server: ${error.status} - ${error.message}`;
      }
      console.error('Server-side error:', error);
    }

    this._error$.next(errorMessage);
    // this._errorsignal.set(errorMessage); 
  }

  // clearError() {
  //   this._errorsignal.set(null); 
  // }
}
