import process from 'node:process'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { injectable, singleton } from 'tsyringe'
import ws from 'ws'

@injectable()
@singleton()
export default class Neon {
  private db: ReturnType<typeof drizzle>

  constructor() {
    neonConfig.webSocketConstructor = ws
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
    this.db = drizzle({ client: pool, logger: true })
  }

  async query(query: string) {
    return this.db.execute(query)
  }

  drizzle() {
    return this.db
  }
}
