import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { NotesServiceModule } from './notes-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotesServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
        host: '0.0.0.0',
      },
    },
  );
  await app.listen();
}
bootstrap();
