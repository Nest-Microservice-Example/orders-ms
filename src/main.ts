import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigEnum } from './config';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
});

async function bootstrap() {
  const logger = new Logger(AppModule.name);

  const context = await NestFactory.createApplicationContext(AppModule);

  const config = context.get(ConfigService);

  const NATS_SERVERS = config.get<string[]>(ConfigEnum.NATS, { infer: true });

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: NATS_SERVERS,
      },
    },
  );

  app.useGlobalPipes(validationPipe);

  await app.listen();

  logger.log(`Orders Microservice running`);
}

bootstrap();
