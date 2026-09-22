import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      let friendlyMessage = 'Ocorreu um erro inesperado na requisição.';

      if (error.error?.message) {
        friendlyMessage = Array.isArray(error.error.message)
          ? error.error.message.join(', ')
          : error.error.message;
      } else if (error.status === 0) {
        friendlyMessage = 'Servidor indisponível. Verifique sua conexão ou se a API está online.';
      } else if (error.status === 401) {
        friendlyMessage = 'Sessão expirada ou não autorizada. Faça login novamente.';
      }

      toastService.showError('Ops! Algo deu errado', friendlyMessage);
      return throwError(() => error);
    })
  );
};
