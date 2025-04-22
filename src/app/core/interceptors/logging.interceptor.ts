import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  constructor(private loggingService: LoggingService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const correlationId = uuidv4();
    const modifiedReq = req.clone({
      headers: req.headers.set('X-Correlation-ID', correlationId)
    });

    this.loggingService.log(`[HTTP REQUEST] [${correlationId}] ${req.method} ${req.url}`, 'info', correlationId);

    return next.handle(modifiedReq).pipe(
      tap({
        next: (event) => {
          this.loggingService.log(`[HTTP RESPONSE] [${correlationId}] ${req.method} ${req.url}`, 'info', correlationId);
        },
        error: (error) => {
          this.loggingService.log(`[HTTP ERROR] [${correlationId}] ${req.method} ${req.url} - ${error.message}`, 'error', correlationId);
        }
      })
    );
  }
}
