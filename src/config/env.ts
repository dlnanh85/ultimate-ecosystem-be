import "dotenv/config";
import z from "zod";

export const envSchema = z.object({
  DB_URI: z.string(),
  CORS_ORIGIN: z.string().default("*"),
  R2_ACCOUNT_ID: z.string(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET: z.string(),
});

const env = {
  DB_URI: process.env.DB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET: process.env.R2_BUCKET,
};

envSchema.parse(env);

export default () => env;
