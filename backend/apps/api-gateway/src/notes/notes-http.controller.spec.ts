import { Test, TestingModule } from '@nestjs/testing';
import { NotesHttpController } from './notes-http.controller';
import { NotesClientService } from './notes-client.service';

describe('NotesHttpController', () => {
  let controller: NotesHttpController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesHttpController],
      providers: [
        {
          provide: NotesClientService,
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

    controller = module.get<NotesHttpController>(NotesHttpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
