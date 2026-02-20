import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NoteResponseDto } from './dto/note-response.dto';

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(AuthGuard('jwt'))
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Get a single note by id' })
  @ApiResponse({ status: 200, type: NoteResponseDto })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: any) {
    return this.notesService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Create a note' })
  @ApiResponse({ status: 201, type: NoteResponseDto })
  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: any) {
    return this.notesService.create(createNoteDto, user);
  }

  @ApiOperation({ summary: 'Update a note' })
  @ApiResponse({ status: 200, type: NoteResponseDto })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @GetUser() user: any,
  ) {
    return this.notesService.update(id, updateNoteDto, user);
  }

  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200 })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: any) {
    return this.notesService.remove(id, user);
  }

  @ApiOperation({ summary: 'List all notes for the authenticated user' })
  @ApiResponse({ status: 200, type: [NoteResponseDto] })
  @Get()
  findAll(@GetUser() user: any) {
    return this.notesService.findAll(user);
  }
}
