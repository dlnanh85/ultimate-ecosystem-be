import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { MemoportService } from "./memoport.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NoteResponseDto } from "./dto/note-response.dto";

@Controller("api/memoport/notes")
export class MemoportController {
  constructor(private readonly memoportService: MemoportService) {}

  @Get()
  findAll(): Promise<NoteResponseDto[]> {
    return this.memoportService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<NoteResponseDto> {
    return this.memoportService.findOne(id);
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    return this.memoportService.create(createNoteDto);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    return this.memoportService.update(id, updateNoteDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string): Promise<void> {
    return this.memoportService.remove(id);
  }
}
