import {
    HttpRequest,
    HttpEvent,
    HttpHandlerFn,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { inject } from '@angular/core';

export function errorHandlingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    var errorService = inject(ErrorService);
    return next(req).pipe(
        catchError( (error) => {
            errorService.handleError(error);
            return throwError(() => error);
        }));
}
