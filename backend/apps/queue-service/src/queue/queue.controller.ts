import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { QueueService } from './queue.service';

@Controller()
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @MessagePattern({ cmd: 'auth.signup' })
  signup(@Payload() payload: { email: string; password: string }) {
    return this.queueService.signup(payload);
  }

  @MessagePattern({ cmd: 'auth.login' })
  login(@Payload() payload: { email: string; password: string }) {
    return this.queueService.login(payload);
  }

  @MessagePattern({ cmd: 'notes.findAll' })
  findAllNotes(@Payload() payload: { user: { id: string } }) {
    return this.queueService.findAllNotes(payload);
  }

  @MessagePattern({ cmd: 'notes.findOne' })
  findOneNote(@Payload() payload: { id: string; user: { id: string } }) {
    return this.queueService.findOneNote(payload);
  }

  @MessagePattern({ cmd: 'notes.create' })
  createNote(@Payload() payload: { dto: { title: string; content: string }; user: { id: string } }) {
    return this.queueService.createNote(payload);
  }

  @MessagePattern({ cmd: 'notes.update' })
  updateNote(
    @Payload()
    payload: {
      id: string;
      dto: { title?: string; content?: string };
      user: { id: string };
    },
  ) {
    return this.queueService.updateNote(payload);
  }

  @MessagePattern({ cmd: 'notes.remove' })
  removeNote(@Payload() payload: { id: string; user: { id: string } }) {
    return this.queueService.removeNote(payload);
  }

  @EventPattern('notes.welcome.create')
  createWelcomeNote(@Payload() payload: { userId: string }) {
    this.queueService.enqueueWelcomeNote(payload);
  }
}
