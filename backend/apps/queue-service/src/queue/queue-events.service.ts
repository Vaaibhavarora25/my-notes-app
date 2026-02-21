import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { QueueDispatcherService } from './queue-dispatcher.service';

@Injectable()
export class QueueEventsService {
  private readonly logger = new Logger(QueueEventsService.name);

  constructor(
    private readonly dispatcher: QueueDispatcherService,
    @Inject('NOTES_SERVICE') private readonly notesClient: ClientProxy,
  ) {}

  enqueueWelcomeNote(payload: { userId: string }) {
    void this.dispatcher
      .enqueue(() =>
        firstValueFrom(
          this.notesClient.send(
            { cmd: 'create' },
            {
              dto: {
                title: 'Welcome!',
                content: `Welcome to My Notes. Your user id is ${payload.userId}.`,
              },
              user: { id: payload.userId },
            },
          ),
        ),
      )
      .catch((error) => {
        this.logger.warn(`Failed to enqueue welcome note: ${String(error)}`);
      });
  }
}
