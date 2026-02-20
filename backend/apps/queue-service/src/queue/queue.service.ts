import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { QueueDispatcherService } from './queue-dispatcher.service';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly dispatcher: QueueDispatcherService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('NOTES_SERVICE') private readonly notesClient: ClientProxy,
  ) {}

  signup(payload: { email: string; password: string }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.userClient.send({ cmd: 'signup' }, payload)),
    );
  }

  login(payload: { email: string; password: string }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.userClient.send({ cmd: 'login' }, payload)),
    );
  }

  findAllNotes(payload: { user: { id: string } }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.notesClient.send({ cmd: 'findAll' }, payload)),
    );
  }

  findOneNote(payload: { id: string; user: { id: string } }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.notesClient.send({ cmd: 'findOne' }, payload)),
    );
  }

  createNote(payload: { dto: { title: string; content: string }; user: { id: string } }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.notesClient.send({ cmd: 'create' }, payload)),
    );
  }

  updateNote(payload: {
    id: string;
    dto: { title?: string; content?: string };
    user: { id: string };
  }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.notesClient.send({ cmd: 'update' }, payload)),
    );
  }

  removeNote(payload: { id: string; user: { id: string } }) {
    return this.dispatcher.enqueue(() =>
      firstValueFrom(this.notesClient.send({ cmd: 'remove' }, payload)),
    );
  }

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
