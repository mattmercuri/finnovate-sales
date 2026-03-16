import { z } from '@hono/zod-openapi'

export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string().optional(),
  profilePicture: z.url().optional()
})

export const OAuthRequestSchema = z.object({
  code: z.string(),
  state: z.string()
}).openapi('OAuthCallbackRequest')

export const CallbackSchema = z.object({
  success: z.boolean(),
  user: UserSchema.optional()
}).openapi('OAuthCallbackResponse')
