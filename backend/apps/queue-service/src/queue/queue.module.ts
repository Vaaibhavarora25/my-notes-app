import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueEventsController } from './queue-events.controller';
import { QueueDispatcherService } from './queue-dispatcher.service';
import { QueueEventsService } from './queue-events.service';

@Module({
  imports: [
    ClientsModule.register([
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
  controllers: [QueueEventsController],
  providers: [QueueDispatcherService, QueueEventsService],
})
export class QueueModule {}
