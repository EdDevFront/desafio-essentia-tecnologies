import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);

    this.logger.error(`HTTP ${status} Error on ${request.method} ${request.url}: ${message}`);

    response.status(status).json({
      statusCode: status,
      message,
      error: exception instanceof HttpException ? exception.name : 'InternalServerError',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const res: any = exception.getResponse();
      if (typeof res === 'object' && res?.message) {
        return Array.isArray(res.message) ? res.message.join(', ') : res.message;
      }
      return exception.message;
    }
    return 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
  }
}
