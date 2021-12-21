import { AppConfigService } from '../environments/app.environment';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { GqlContextType, GqlExceptionFilter } from '@nestjs/graphql';
import {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
  PersistedQueryNotFoundError,
} from 'apollo-server-errors';

const apolloPredefinedExceptions = {
  401: AuthenticationError,
  403: ForbiddenError,
  404: PersistedQueryNotFoundError,
};

@Catch()
export class ExceptionFilter implements GqlExceptionFilter {
  private logger = new Logger(ExceptionFilter.name);

  constructor(private readonly appEnvironment: AppConfigService) {}

  catch(exception: HttpException | Error, host: ArgumentsHost) {
    if (host.getType<GqlContextType>() !== 'graphql')
      return this.handleHttpException(exception, host);

    if (exception instanceof HttpException) {
      const error: ApolloError =
        exception.getStatus() in apolloPredefinedExceptions
          ? new apolloPredefinedExceptions[exception.getStatus()](
              exception.message
            )
          : new ApolloError(
              exception.message,
              exception.getStatus().toString()
            );
      throw error;
    }

    const name = exception.constructor.name;

    if (name === 'PrismaClientKnownRequestError2')
      throw new ApolloError(exception.message, 'NOT_FOUND');

    const error = new ApolloError(exception.message, 'INTERNAL_SERVER_ERROR');

    throw error;
  }

  handleHttpException(exception: HttpException | Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();

    if (exception instanceof HttpException)
      return res.status(exception.getStatus()).json(exception.getResponse());

    const newException = new InternalServerErrorException();

    this.logger.error(exception);

    return res
      .status(newException.getStatus())
      .json(newException.getResponse());
  }

  // catch(exception: any, host: ArgumentsHost) {
  //     if (host.getType() === 'http') {
  //         // todo: need find status code
  //         const response = host.switchToHttp().getResponse<Response>();
  //         return response.status(500).json({
  //             timestamp: new Date().toISOString(),
  //             errors: serializeError(exception),
  //         });
  //     }

  //     console.log(exception);
  //     if (exception.constructor.name === 'PrismaClientValidationError') {
  //         exception.type = 'Validation Error';
  //         exception.code = '400';
  //         exception.name = 'Validation Error';
  //         exception.response = { message: exception.message, statusCode: 400 };
  //         return exception;
  //     }

  //     if (exception.constructor.name === 'PrismaClientKnownRequestError2') {
  //         exception.type = 'Not found';
  //         exception.code = '404';
  //         exception.name = 'Not found';
  //         exception.response = { message: exception.message, statusCode: 404 };
  //         return exception;
  //     }

  //     if (exception.constructor.name === 'NotFoundError') {
  //         exception.type = 'Not found';
  //         exception.code = '404';
  //         exception.name = 'Not found';
  //         exception.response = { message: exception.message, statusCode: 404 };
  //         return exception;
  //     }

  //     if (exception.constructor.name === 'UnauthorizedException') {
  //         exception.type = 'Unauthorized';
  //         exception.code = '401';
  //         exception.name = 'Unauthorized';
  //         exception.response = { message: exception.message, statusCode: 401 };
  //         return exception;
  //     }

  //     if (typeof exception === 'object') {
  //         if (!exception.type) {
  //             exception.type = exception.response.error;
  //         }

  //         if (!exception.code) {
  //             exception.code = exception.response.statusCode;
  //         }

  //         if (!exception.name) {
  //             exception.name = exception.response.message;
  //         }
  //     }

  //     return exception;
  // }
}
