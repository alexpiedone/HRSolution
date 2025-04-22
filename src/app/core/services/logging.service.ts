import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({providedIn: 'root'})

export class LoggingService {

  constructor(private http: HttpClient) {}

  log(message: string, level: 'info' | 'error' = 'info', correlationId?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId,
      app: 'HR-Frontend',
    };

    if (!environment.production) {
      this.http.post(`${environment.apiUrl}/Logs/Create`, logEntry).subscribe({
        error: (err) => {
          console.error('Nu am putut trimite logul:', err);
        }
      });
    }

    this.http.post(`${environment.apiUrl}/logs/Create`, logEntry).subscribe({
      error: (err) => console.error('Nu am putut trimite logul:', err)
    });
  }
}
