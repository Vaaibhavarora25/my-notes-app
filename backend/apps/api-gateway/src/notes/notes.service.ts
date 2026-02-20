import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@Inject('QUEUE_SERVICE') private client: ClientProxy) {}

  findAll(user: any) {
    return this.client.send({ cmd: 'notes.findAll' }, { user });
  }

  findOne(id: string, user: any) {
    return this.client.send({ cmd: 'notes.findOne' }, { id, user });
  }

  create(dto: CreateNoteDto, user: any) {
    return this.client.send({ cmd: 'notes.create' }, { dto, user });
  }

  update(id: string, dto: UpdateNoteDto, user: any) {
    return this.client.send({ cmd: 'notes.update' }, { id, dto, user });
  }

  remove(id: string, user: any) {
    return this.client.send({ cmd: 'notes.remove' }, { id, user });
  }
}
