import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);

    this.logger.error(`HTTP ${status} Error on ${request.method} ${request.url}: ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      error: isHttpException ? exception.name : 'InternalServerError',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractMessage(exception: unknown): string {
    const isHttpException = exception instanceof HttpException;
    if (isHttpException) {
      const res = exception.getResponse() as Record<string, unknown> | string;
      const isObjectResponse = typeof res === 'object' && res !== null && Boolean(res.message);
      if (isObjectResponse) {
        const messageVal = (res as Record<string, unknown>).message;
        const isArrayMessage = Array.isArray(messageVal);
        return isArrayMessage ? messageVal.join(', ') : String(messageVal);
      }
      return exception.message;
    }
    return 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
  }
}
