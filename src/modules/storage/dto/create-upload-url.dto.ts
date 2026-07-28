import { IsIn, IsString } from "class-validator";

export const ALLOWED_UPLOAD_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
] as const;

export class CreateUploadUrlDto {
  @IsString()
  @IsIn(ALLOWED_UPLOAD_CONTENT_TYPES)
  contentType: string;
}
