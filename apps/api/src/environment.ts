import { z } from "zod";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const EnvSchema = z.strictObject({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

export const environmentConfig = EnvSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  JWT_SECRET: process.env.JWT_SECRET,
});

export type EnvironmentConfig = z.infer<typeof EnvSchema>;
