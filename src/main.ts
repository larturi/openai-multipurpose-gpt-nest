import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/interfaces/environment.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  const configService = app.get(ConfigService<EnvironmentVariables>);
  const port = configService.get('app.port', { infer: true }) as string;
  await app.listen(port);
}

bootstrap();
