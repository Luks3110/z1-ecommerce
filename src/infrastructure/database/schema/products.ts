import { boolean, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: integer('price').notNull(),
    stock: integer('stock').notNull(),
    isAvailable: boolean('is_available').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
})
