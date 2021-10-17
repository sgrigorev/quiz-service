import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';
import { AppModule } from './app.module';

class AppErrorFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AppErrorFilter.name);

  catch(error: Error, host: ArgumentsHost) {
    this.logger.error(error);

    const res = host.switchToHttp().getResponse<Response>();
    if (error instanceof HttpException) {
      res.status(error.getStatus()).send(error.getResponse());
      return;
    }

    if (error instanceof AppError) {
      res.status(HttpStatus.BAD_REQUEST).send({
        ...error.toJson(),
      });
      return;
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: error.message,
    });
  }
}

class AppError extends Error {
  constructor(message: string) {
    super(message);
  }

  toJson(): Record<string, unknown> {
    return {
      message: this.message,
    };
  }
}

class InvalidDataError extends AppError {
  constructor(
    readonly errors: ValidationError[],
    message: string = 'Invalid data',
  ) {
    super(message);
  }

  toJson(): Record<string, unknown> {
    return {
      ...super.toJson(),
      errors: this.errors,
    };
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      validationError: {
        target: false,
        value: true,
      },
      exceptionFactory: (errors) => new InvalidDataError(errors),
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AppErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Quiz App')
    .setDescription('The quiz app API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    uiConfig: {
      validatorUrl: null,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
