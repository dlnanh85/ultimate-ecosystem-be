import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { Note, NoteDocument } from "./schemas/note.schema";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NoteResponseDto } from "./dto/note-response.dto";

@Injectable()
export class MemoportService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async findAll(): Promise<NoteResponseDto[]> {
    const notes = await this.noteModel.find().sort({ createdAt: -1 }).exec();
    return notes.map((note) => this.toResponseDto(note));
  }

  async findOne(id: string): Promise<NoteResponseDto> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return this.toResponseDto(note);
  }

  async create(createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    const note = await this.noteModel.create(createNoteDto);
    return this.toResponseDto(note);
  }

  async update(
    id: string,
    updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    const note = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { returnDocument: "after" })
      .exec();
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    return this.toResponseDto(note);
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
    const note = await this.noteModel.findByIdAndDelete(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }

  private toResponseDto(note: NoteDocument): NoteResponseDto {
    return {
      id: note._id.toString(),
      title: note.title,
      content: note.content,
      createdAt: (note as unknown as { createdAt: Date }).createdAt,
      updatedAt: (note as unknown as { updatedAt: Date }).updatedAt,
    };
  }
}
