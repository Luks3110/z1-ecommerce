import process from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { injectable, singleton } from 'tsyringe'

@injectable()
@singleton()
export default class Database {
  private db: ReturnType<typeof drizzle>

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
    this.db = drizzle(pool, { logger: process.env.NODE_ENV === 'development' })
  }

  drizzle() {
    return this.db
  }
}
