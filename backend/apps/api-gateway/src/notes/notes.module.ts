import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotesClientService } from './notes-client.service';
import { NotesHttpController } from './notes-http.controller';

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
  controllers: [NotesHttpController],
  providers: [NotesClientService],
})
export class NotesGatewayModule { }
