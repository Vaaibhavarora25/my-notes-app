import { Test, TestingModule } from '@nestjs/testing';
import { NotesClientService } from './notes-client.service';

describe('NotesClientService', () => {
  let service: NotesClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesClientService,
        {
          provide: 'NOTES_SERVICE',
          useValue: {
            send: jest.fn(),
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesClientService>(NotesClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
