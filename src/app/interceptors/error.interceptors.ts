import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err) => {
      const message = err?.error?.message || 'An unexpected error occurred';
      // Optionally surface field errors: err?.error?.errors (map of field -> message)
      console.error('API Error:', message, err?.error?.errors);
      return throwError(() => err);
    })
  );