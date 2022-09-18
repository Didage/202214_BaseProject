// eslint-disable-next-line prettier/prettier
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { BusinessError } from './business_errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.tipo === BusinessError.NOT_FOUND)
          throw new HttpException(
            {
              codigoError: HttpStatus.NOT_FOUND,
              mensaje: error.mensaje,
            },
            HttpStatus.NOT_FOUND,
          );
        else if (error.tipo === BusinessError.PRECONDITION_FAILED)
          throw new HttpException(
            {
              codigoError: HttpStatus.PRECONDITION_FAILED,
              mensaje: error.mensaje,
            },
            HttpStatus.PRECONDITION_FAILED,
          );
        else if (error.tipo === BusinessError.BAD_REQUEST)
          throw new HttpException(
            {
              codigoError: HttpStatus.BAD_REQUEST,
              mensaje: error.mensaje,
            },
            HttpStatus.BAD_REQUEST,
          );
        else throw error;
      }),
    );
  }
}
