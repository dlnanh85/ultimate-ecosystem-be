import { Body, Controller, Post } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { CreateUploadUrlDto } from "./dto/create-upload-url.dto";
import { CreateDownloadUrlDto } from "./dto/create-download-url.dto";
import { UploadUrlResponseDto } from "./dto/upload-url-response.dto";
import { DownloadUrlResponseDto } from "./dto/download-url-response.dto";

@Controller("api/storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post("uploads")
  createUploadUrl(
    @Body() createUploadUrlDto: CreateUploadUrlDto,
  ): Promise<UploadUrlResponseDto> {
    return this.storageService.createUploadUrl(createUploadUrlDto.contentType);
  }

  @Post("downloads")
  createDownloadUrl(
    @Body() createDownloadUrlDto: CreateDownloadUrlDto,
  ): Promise<DownloadUrlResponseDto> {
    return this.storageService.createDownloadUrl(createDownloadUrlDto.key);
  }
}
