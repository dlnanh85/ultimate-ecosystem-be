import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { Note, NoteDocument } from "./schemas/note.schema";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { NoteResponseDto } from "./dto/note-response.dto";
import { StorageService } from "../storage/storage.service";

const IMAGE_TOKEN_PATTERN = /\[img\s+([^\]]+)\]/g;

@Injectable()
export class MemoportService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    private readonly storageService: StorageService,
  ) {}

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

    const keys = this.extractImageKeys(note.content);
    const images = await Promise.all(
      keys.map(async (key) => ({
        key,
        url: (await this.storageService.createDownloadUrl(key)).downloadUrl,
      })),
    );

    return { ...this.toResponseDto(note), images };
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

  private extractImageKeys(content: string): string[] {
    const keys = new Set<string>();
    for (const match of content.matchAll(IMAGE_TOKEN_PATTERN)) {
      keys.add(match[1].trim());
    }
    return [...keys];
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
