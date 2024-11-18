import type { users } from '@infra/database/schema/users'

export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export type NewUser = typeof users.$inferInsert
