import z from "zod";

export const envSchema = z.object({
  DB_URI: z.string(),
});

const env = {
  DB_URI: process.env.DB_URI,
};

envSchema.parse(env);

export default () => env;
