import { z } from "zod";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const EnvSchema = z.strictObject({
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  IS_DEV: z.boolean().default(false),
  FRONTEND_URL: z.string().min(1).default('http://localhost:3000'),
});

export const environmentConfig = EnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  IS_DEV: process.env.NODE_ENV !== 'production',
  FRONTEND_URL: process.env.FRONTEND_URL,
});

export type EnvironmentConfig = z.infer<typeof EnvSchema>;
