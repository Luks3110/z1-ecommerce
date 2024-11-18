import { z } from '@hono/zod-openapi'

const schema = z
  .object({
    name: z.string().min(1),
  })
  .openapi('Schema')

export default schema
