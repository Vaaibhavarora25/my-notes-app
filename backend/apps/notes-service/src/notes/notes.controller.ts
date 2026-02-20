import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @MessagePattern({ cmd: 'findOne' })
  findOne(@Payload() payload: { id: string, user: any }) {
    return this.notesService.findOne(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'create' })
  create(@Payload() payload: { dto: CreateNoteDto, user: any }) {
    return this.notesService.create(payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'update' })
  update(@Payload() payload: { id: string, dto: UpdateNoteDto, user: any }) {
    return this.notesService.update(payload.id, payload.dto, payload.user);
  }

  @MessagePattern({ cmd: 'remove' })
  remove(@Payload() payload: { id: string, user: any }) {
    return this.notesService.remove(payload.id, payload.user);
  }

  @MessagePattern({ cmd: 'findAll' })
  findAll(@Payload() payload: { user: any }) {
    return this.notesService.findAll(payload.user);
  }
}
