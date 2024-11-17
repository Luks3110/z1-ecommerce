import { z } from '@hono/zod-openapi';

export const productSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2),
    description: z.string(),
    price: z.number().min(0),
    stock: z.number().min(0),
    isAvailable: z.boolean(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
}).openapi('Product');

export const productCreateSchema = productSchema.omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true 
}).openapi('ProductCreate');

export const productUpdateSchema = productSchema.partial().omit({ 
    id: true 
}).openapi('ProductUpdate');

export type ProductSchema = z.infer<typeof productSchema>; 
