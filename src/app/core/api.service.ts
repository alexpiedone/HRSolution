import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from './services/logging.service';
import { environment } from '../../environment/environment';
  
@Injectable({ providedIn: 'root' })
export class ApiService<T> {
  constructor(
    protected http: HttpClient,
    private loggingService: LoggingService,
    @Inject(String) protected endpoint: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUrl}/${this.endpoint}/GetAll`).pipe(
      tap({
        next: (data) => {
          this.loggingService.log(`Received data from ${this.endpoint}`, 'info');
        },
        error: (error) => {
          this.loggingService.log(`Error during GET request to ${this.endpoint}: ${error.message}`, 'error');
        }
      }),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${environment.apiUrl}/${this.endpoint}/GetById/${id}`).pipe(catchError(this.handleError));
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(`${environment.apiUrl}/${this.endpoint}/Create`, item).pipe(catchError(this.handleError));
  }

  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${environment.apiUrl}/${this.endpoint}/Update`, item).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${this.endpoint}/Delete`).pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse) {
    console.error(error);

    const msg = error.error?.message || 'Eroare la comunicarea cu serverul';
    console.error(`[API Error] ${msg}`);
    return throwError(() => new Error(msg));
  }
}
