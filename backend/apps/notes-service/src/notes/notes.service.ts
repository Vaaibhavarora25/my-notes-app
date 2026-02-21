import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesDomainService {
  constructor(private prisma: PrismaService) { }

  async findAll(user: any): Promise<any[]> {
    return this.prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, user: any): Promise<any> {
    const note = await this.prisma.note.findFirst({
      where: { id, userId: user.id },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async create(dto: CreateNoteDto, user: any): Promise<any> {
    return this.prisma.note.create({
      data: {
        ...dto,
        userId: user.id,
      },
    });
  }

  async update(id: string, dto: UpdateNoteDto, user: any): Promise<any> {
    await this.findOne(id, user);

    return this.prisma.note.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, user: any) {
    await this.findOne(id, user);
    await this.prisma.note.delete({
      where: { id },
    });
    return { message: 'Note deleted successfully' };
  }
}
