import { z } from '@hono/zod-openapi'

export const applicationErrorSchema = z.object({
    name: z.string(),
    message: z.string(),
    source: z.string().optional()
  }).openapi('ApplicationError')

export type ApplicationErrorSchema = z.infer<typeof applicationErrorSchema>
