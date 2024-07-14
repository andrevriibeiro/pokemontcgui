import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';
import { AlertService } from '../services/alert.service';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = Injector.create({
    providers: [{ provide: AlertService, useClass: AlertService, deps: [] }]
  }).get(AlertService);

  const apiKey = environment.apiKey;

  const clonedReq = req.clone({
    setHeaders: {
      'X-Api-Key': apiKey,
    },
  });

  return next(clonedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        const message = err.error.error.message;
        alertService.showError(message, '');
      }
      return throwError(() => err);
    })
  );
};
