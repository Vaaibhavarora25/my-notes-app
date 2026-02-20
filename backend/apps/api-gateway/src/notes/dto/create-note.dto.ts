import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'My first note' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'This is the body of the note.' })
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  content: string;
}
