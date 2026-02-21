import { Test, TestingModule } from '@nestjs/testing';
import { NotesRpcController } from './notes-rpc.controller';
import { NotesDomainService } from './notes.service';

describe('NotesRpcController', () => {
  let controller: NotesRpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesRpcController],
      providers: [
        {
          provide: NotesDomainService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotesRpcController>(NotesRpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
