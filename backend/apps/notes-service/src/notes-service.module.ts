import { Module } from '@nestjs/common';
import { NotesDomainModule } from './notes/notes.module';

@Module({
  imports: [NotesDomainModule],
  controllers: [],
  providers: [],
})
export class NotesServiceModule { }
