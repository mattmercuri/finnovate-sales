import { z } from "zod";
import type { Context } from "hono";
import { env } from "hono/adapter";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.string().min(1),
});

export const getEnvironmentConfig = (c: Context) => {
  const rawEnv = env(c);

  const parsedEnv = envSchema.parse({
    GOOGLE_CLIENT_ID: rawEnv.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: rawEnv.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: rawEnv.GOOGLE_REDIRECT_URI,
  });

  return {
    googleOAuth: {
      clientId: parsedEnv.GOOGLE_CLIENT_ID,
      clientSecret: parsedEnv.GOOGLE_CLIENT_SECRET,
      redirectUri: parsedEnv.GOOGLE_REDIRECT_URI,
    },
  };
};

export type EnvironmentConfig = ReturnType<typeof getEnvironmentConfig>;
