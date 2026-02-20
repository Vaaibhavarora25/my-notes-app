import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.notesService.findOne(id, user);
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: any) {
    return this.notesService.create(createNoteDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @GetUser() user: any,
  ) {
    return this.notesService.update(id, updateNoteDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.notesService.remove(id, user);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.notesService.findAll(user);
  }
}
