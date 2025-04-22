import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService<T> {
  constructor(
    protected http: HttpClient,
    @Inject(String) protected endpoint: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.endpoint}`).pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(`${this.endpoint}`, item).pipe(catchError(this.handleError));
  }

  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, item).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(catchError(this.handleError));
  }

  protected handleError(error: HttpErrorResponse) {
    const msg = error.error?.message || 'Eroare la comunicarea cu serverul';
    console.error(`[API Error] ${msg}`);
    return throwError(() => new Error(msg));
  }
}
