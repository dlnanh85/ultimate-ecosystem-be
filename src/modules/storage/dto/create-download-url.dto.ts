import { IsNotEmpty, IsString } from "class-validator";

export class CreateDownloadUrlDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
