import { z } from '@hono/zod-openapi';

const orderItemSchema = z.object({
    id: z.number().optional(),
    orderId: z.number().optional(),
    productId: z.number(),
    quantity: z.number().min(1),
    priceAtTime: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
}).openapi('OrderItem');

export const orderSchema = z.object({
    id: z.number().optional(),
    userId: z.number().nullable(),
    totalPrice: z.number().optional(),
    items: z.array(orderItemSchema),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
}).openapi('Order');

export const orderCreateSchema = z.object({
    userId: z.number().nullable(),
    items: z.array(z.object({
        productId: z.number(),
        quantity: z.number().min(1)
    }))
}).openapi('OrderCreate');

export type OrderSchema = z.infer<typeof orderSchema>; 
