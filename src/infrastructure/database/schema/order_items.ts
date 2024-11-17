import { integer, timestamp } from "drizzle-orm/pg-core";

import { pgTable, serial } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable('order_items', {
    id: serial('id').primaryKey(),
    orderId: integer('order_id')
        .references(() => orders.id)
        .notNull(),
    productId: integer('product_id')
        .references(() => products.id)
        .notNull(),
    quantity: integer('quantity').notNull(),
    priceAtTime: integer('price_at_time').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow()
});
