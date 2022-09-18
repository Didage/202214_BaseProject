// eslint-disable-next-line prettier/prettier
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from './business_errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.type === BusinessError.NOT_FOUND)
          throw new HttpException(
            {
              codigoError: HttpStatus.NOT_FOUND,
              message: error.message,
            },
            HttpStatus.NOT_FOUND,
          );
        else if (error.type === BusinessError.PRECONDITION_FAILED)
          throw new HttpException(
            {
              codigoError: HttpStatus.PRECONDITION_FAILED,
              message: error.message,
            },
            HttpStatus.PRECONDITION_FAILED,
          );
        else if (error.type === BusinessError.BAD_REQUEST)
          throw new HttpException(
            {
              codigoError: HttpStatus.BAD_REQUEST,
              message: error.message,
            },
            HttpStatus.BAD_REQUEST,
          );
        else throw error;
      }),
    );
  }
}
