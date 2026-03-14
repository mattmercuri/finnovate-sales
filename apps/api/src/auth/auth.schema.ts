import { z } from '@hono/zod-openapi'

export const OAuthRequestSchema = z.object({
  code: z.string(),
  state: z.string()
}).openapi('OAuthCallbackRequest')

export const CallbackSchema = z.object({
  success: z.boolean(),
  user: z.object({
    email: z.email(),
    name: z.string().optional(),
    profilePicture: z.url().optional()
  }).optional()
}).openapi('OAuthCallbackResponse')
