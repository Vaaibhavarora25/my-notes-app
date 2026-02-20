import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUEUE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.QUEUE_SERVICE_HOST || '127.0.0.1',
          port: Number(process.env.QUEUE_SERVICE_PORT || 3004),
        },
      },
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule { }
