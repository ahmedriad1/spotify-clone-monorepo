import { ExceptionFilter } from './utils/exception-filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UserInputError } from 'apollo-server-errors';
import { useContainer, ValidationError } from 'class-validator';
import { AppConfigService } from './environments/app.environment';
import { AppModule } from './app/app.module';
import { graphqlUploadExpress } from 'graphql-upload';

const main = async () => {
  const app = await NestFactory.create(AppModule);

  // config
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        return new UserInputError('VALIDATION_ERROR', {
          invalidArgs: errors,
        });
      },
    })
  );
  const appConfig = app.get(AppConfigService);
  app.useGlobalFilters(new ExceptionFilter(appConfig));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(graphqlUploadExpress());

  await app.listen(appConfig.port);

  const logger = app.get(Logger);
  app.useLogger(logger);

  logger.log(
    `GraphQL application is running on: ${await app.getUrl()}`,
    'main'
  );
};

main();
