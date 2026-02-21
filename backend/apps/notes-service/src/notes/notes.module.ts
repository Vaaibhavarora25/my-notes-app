import { Module } from '@nestjs/common';
import { NotesDomainService } from './notes.service';
import { NotesRpcController } from './notes-rpc.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [NotesRpcController],
  providers: [NotesDomainService],
  imports: [PrismaModule],
})
export class NotesDomainModule { }
