import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadUrlResponseDto } from "./dto/upload-url-response.dto";
import { DownloadUrlResponseDto } from "./dto/download-url-response.dto";

const UPLOAD_URL_EXPIRY_SECONDS = 5 * 60;
const DOWNLOAD_URL_EXPIRY_SECONDS = 15 * 60;

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
};

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>("R2_ACCOUNT_ID");
    this.bucket = this.configService.get<string>("R2_BUCKET")!;
    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get<string>("R2_ACCESS_KEY_ID")!,
        secretAccessKey: this.configService.get<string>(
          "R2_SECRET_ACCESS_KEY",
        )!,
      },
    });
  }

  async createUploadUrl(contentType: string): Promise<UploadUrlResponseDto> {
    const extension = EXTENSION_BY_CONTENT_TYPE[contentType];
    const key = `uploads/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: UPLOAD_URL_EXPIRY_SECONDS,
    });

    return { key, uploadUrl, expiresIn: UPLOAD_URL_EXPIRY_SECONDS };
  }

  async createDownloadUrl(key: string): Promise<DownloadUrlResponseDto> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const downloadUrl = await getSignedUrl(this.client, command, {
      expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS,
    });

    return { downloadUrl, expiresIn: DOWNLOAD_URL_EXPIRY_SECONDS };
  }
}
