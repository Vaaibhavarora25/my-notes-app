import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesClientService {
  constructor(@Inject('NOTES_SERVICE') private client: ClientProxy) {}

  findAll(user: any) {
    return this.client.send({ cmd: 'findAll' }, { user });
  }

  findOne(id: string, user: any) {
    return this.client.send({ cmd: 'findOne' }, { id, user });
  }

  create(dto: CreateNoteDto, user: any) {
    return this.client.send({ cmd: 'create' }, { dto, user });
  }

  update(id: string, dto: UpdateNoteDto, user: any) {
    return this.client.send({ cmd: 'update' }, { id, dto, user });
  }

  remove(id: string, user: any) {
    return this.client.send({ cmd: 'remove' }, { id, user });
  }
}
