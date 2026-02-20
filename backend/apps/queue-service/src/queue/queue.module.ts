import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueController } from './queue.controller';
import { QueueDispatcherService } from './queue-dispatcher.service';
import { QueueService } from './queue.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.USER_SERVICE_PORT || 3003),
        },
      },
      {
        name: 'NOTES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTES_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.NOTES_SERVICE_PORT || 3002),
        },
      },
    ]),
  ],
  controllers: [QueueController],
  providers: [QueueDispatcherService, QueueService],
})
export class QueueModule {}
