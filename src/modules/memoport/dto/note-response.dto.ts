export class NoteImageDto {
  key: string;
  url: string;
}

export class NoteResponseDto {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images?: NoteImageDto[];
}
