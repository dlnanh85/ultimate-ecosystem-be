import "dotenv/config";
import z from "zod";

export const envSchema = z.object({
  DB_URI: z.string(),
  CORS_ORIGIN: z.string().default("*"),
});

const env = {
  DB_URI: process.env.DB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

envSchema.parse(env);

export default () => env;
