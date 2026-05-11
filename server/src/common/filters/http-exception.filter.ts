import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์';

    if (exception instanceof HttpException) {
      const res = exception.getResponse() as any;
      message = res.message || res;
    } else {
      // ดักจับ Error อื่นๆ เช่น Database Connection
      const err = exception as any;
      if (err.code === 'ECONNREFUSED') {
        message = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้';
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
