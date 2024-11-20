import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";
import process from 'node:process';

config();

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/infrastructure/database/schema',
    out: './src/infrastructure/database/migrations',
    dbCredentials: {
        host: 'localhost',
        port: 5432,
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DB!,
        ssl: false
    },
    verbose: true,
    strict: true,
});
