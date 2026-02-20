import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTES_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.NOTES_SERVICE_HOST || '127.0.0.1',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule { }
