import { Test, TestingModule } from '@nestjs/testing';
import { NotesDomainService } from './notes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NotesDomainService', () => {
  let service: NotesDomainService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      note: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesDomainService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<NotesDomainService>(NotesDomainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all notes for a user', async () => {
      const mockNotes = [{ id: '1', title: 'Test', userId: 'user1' }];
      prisma.note.findMany.mockResolvedValue(mockNotes);

      const result = await service.findAll({ id: 'user1' });
      expect(result).toEqual(mockNotes);
      expect(prisma.note.findMany).toHaveBeenCalledWith({
        where: { userId: 'user1' },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should create a note', async () => {
      const dto = { title: 'New Note', content: 'Content' };
      const user = { id: 'user1' };
      const mockNote = { id: '1', ...dto, userId: 'user1' };
      prisma.note.create.mockResolvedValue(mockNote);

      const result = await service.create(dto, user);
      expect(result).toEqual(mockNote);
      expect(prisma.note.create).toHaveBeenCalledWith({
        data: { ...dto, userId: 'user1' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a note if found', async () => {
      const mockNote = { id: '1', title: 'Note', userId: 'user1' };
      prisma.note.findFirst.mockResolvedValue(mockNote);

      const result = await service.findOne('1', { id: 'user1' });
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException if note not found', async () => {
      prisma.note.findFirst.mockResolvedValue(null);
      await expect(service.findOne('1', { id: 'user1' })).rejects.toThrow(NotFoundException);
    });
  });
});

