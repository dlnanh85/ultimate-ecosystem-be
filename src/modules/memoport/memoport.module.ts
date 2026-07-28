import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MemoportController } from "./memoport.controller";
import { MemoportService } from "./memoport.service";
import { Note, NoteSchema } from "./schemas/note.schema";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    StorageModule,
  ],
  controllers: [MemoportController],
  providers: [MemoportService],
})
export class MemoportModule {}
