import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { STATUS_CODE_ERRORS } from '../const/error.const';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  logger = new Logger('AppExceptionFilter');

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpException = exception instanceof HttpException ? exception : null;
    const status = httpException ? httpException.getStatus() : 500;
    const message = this.getMessage(httpException?.getResponse() || '', status);

    const jsonResponse = {
      statusCode: status,
      message,
    };

    const logError = {
      message: jsonResponse.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(logError, exception.stack);

    response.status(status).json(jsonResponse);
  }

  getMessage(response: any, status: number): string {
    const message =
      STATUS_CODE_ERRORS[status] || response['message'] || response;
    return message;
  }
}
