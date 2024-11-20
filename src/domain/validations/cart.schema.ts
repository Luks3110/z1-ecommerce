import { z } from '@hono/zod-openapi'

export const cartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  name: z.string(),
}).openapi('CartItem')

export const cartCreateItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
}).openapi('CartCreateItem')

export const cartCreateSchema = z.object({
  userId: z.number(),
  items: z.array(cartCreateItemSchema).min(1),
}).openapi('CartCreate')

export const cartResponseSchema = z.object({
  id: z.string(),
  userId: z.number(),
  items: z.array(cartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
}).openapi('CartResponse')

export const addItemSchema = cartCreateItemSchema.openapi('AddCartItem')

export const updateQuantitySchema = z.object({
  quantity: z.number().min(0),
}).openapi('UpdateCartItemQuantity')

export type CartSchema = z.infer<typeof cartResponseSchema>
export type CartCreateSchema = z.infer<typeof cartCreateSchema>
export type CartCreateItemSchema = z.infer<typeof cartCreateItemSchema>
