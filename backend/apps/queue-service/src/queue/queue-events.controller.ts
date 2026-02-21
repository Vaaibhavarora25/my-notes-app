import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueEventsService } from './queue-events.service';

@Controller()
export class QueueEventsController {
  constructor(private readonly queueService: QueueEventsService) {}

  @EventPattern('notes.welcome.create')
  createWelcomeNote(@Payload() payload: { userId: string }) {
    this.queueService.enqueueWelcomeNote(payload);
  }
}
