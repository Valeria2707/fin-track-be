import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

type ExceptionPayload = string | { message?: string | string[] };

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const payload = exception.getResponse() as ExceptionPayload;

    response.status(status).json({
      statusCode: status,
      message: extractMessage(payload),
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}

function extractMessage(payload: ExceptionPayload): string {
  if (typeof payload === 'string') return payload;

  const raw = payload?.message;

  if (Array.isArray(raw)) return raw.join(', ');
  if (typeof raw === 'string') return raw;

  return 'Unexpected error';
}
