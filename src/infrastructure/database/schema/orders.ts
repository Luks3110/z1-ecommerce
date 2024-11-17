import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    totalPrice: integer('total_price').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});

