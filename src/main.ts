import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

const configService = new ConfigService();

async function bootstrap() {
  const RABBITMQ_USER = configService.get<string>('RABBITMQ_USER');
  const RABBITMQ_PASS = configService.get<string>('RABBITMQ_PASS');
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_URL}`],
      noAck: false,
      queue: 'challenge',
    },
  });

  await app.listen();
}
bootstrap();
