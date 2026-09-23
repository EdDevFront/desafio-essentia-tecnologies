import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

const ERROR_TRANSLATIONS: Record<string, string> = {
  'Invalid credentials': 'E-mail ou senha incorretos. Verifique suas credenciais.',
  'Email already registered': 'Este e-mail já está cadastrado na plataforma.',
  'User not found or token invalid': 'Sessão inválida ou expirada. Faça login novamente.',
  'Unauthorized': 'Não autorizado. Faça login para acessar.',
  'Bad Request': 'Os dados enviados são inválidos.',
  'Internal Server Error': 'Erro interno no servidor. Tente novamente mais tarde.',
  'email must be an email': 'O campo e-mail deve ser um endereço de e-mail válido.',
  'password must be longer than or equal to 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
  'title should not be empty': 'O título da tarefa é obrigatório.',
  'dueDate must be a valid ISO 8601 date string': 'A data de entrega informada é inválida.',
  'dueDate must be a ISO8601 formatted date': 'A data de entrega informada é inválida.'
};

function translateSingleMessage(msg: string): string {
  if (ERROR_TRANSLATIONS[msg]) return ERROR_TRANSLATIONS[msg];

  if (typeof msg === 'string') {
    if (msg.includes('dueDate') || msg.includes('ISO 8601') || msg.includes('date string')) {
      return 'A data de entrega informada é inválida.';
    }
    if (msg.includes('title')) {
      return 'O título da tarefa é obrigatório.';
    }
    if (msg.includes('email')) {
      return 'O e-mail informado é inválido.';
    }
    if (msg.includes('password')) {
      return 'A senha não atende aos requisitos mínimos.';
    }
  }

  return msg || 'Ocorreu um erro inesperado na requisição.';
}

export function translateMessage(rawMessage: string | string[] | unknown): string {
  if (!rawMessage) return 'Ocorreu um erro inesperado na requisição.';
  if (Array.isArray(rawMessage)) {
    return rawMessage.map(msg => translateSingleMessage(String(msg))).join(', ');
  }
  return translateSingleMessage(String(rawMessage));
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error) => {
      let friendlyMessage = 'Ocorreu um erro inesperado na requisição.';

      if (error.error?.message) {
        friendlyMessage = translateMessage(error.error.message);
      } else if (error.status === 0) {
        friendlyMessage = 'Servidor indisponível. Verifique sua conexão com a internet ou se a API está ativa.';
      } else if (error.status === 401) {
        friendlyMessage = 'Sessão expirada. Faça login novamente.';
      }

      toastService.showError('Ops! Algo deu errado', friendlyMessage);
      return throwError(() => error);
    })
  );
};
