import z from "zod";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const ConfigSchema = z.strictObject({
  googleOAuth: z.strictObject({
    clientId: z.string(),
    clientSecret: z.string(),
    redirectUri: z.string()
  }),
})

export type Config = z.infer<typeof ConfigSchema>;

const config: Config = ConfigSchema.parse({
  googleOAuth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
  },
});

export default config;
