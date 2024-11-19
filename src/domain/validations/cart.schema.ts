import { z } from '@hono/zod-openapi'

export const cartItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  name: z.string(),
}).openapi('CartItem')

export const cartResponseSchema = z.object({
  id: z.string(),
  userId: z.number(),
  items: z.array(cartItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
}).openapi('CartResponse')

export const addItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.number().min(0),
  name: z.string(),
}).openapi('AddCartItem')

export const updateQuantitySchema = z.object({
  quantity: z.number().min(0),
}).openapi('UpdateCartItemQuantity')
