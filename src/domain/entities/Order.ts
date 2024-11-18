import type { orderItems } from '@infra/database/schema/order_items'
import type { orders } from '@infra/database/schema/orders'
import type { User } from './User'

export interface Order {
  id: number
  userId: number | null
  totalPrice: number
  createdAt: Date
  updatedAt: Date
  user?: User
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  priceAtTime: number
  createdAt: Date
  updatedAt: Date
}

export type NewOrder = typeof orders.$inferInsert
export type NewOrderItem = typeof orderItems.$inferInsert

export interface CreateOrderData {
  userId: number
  items: Array<typeof orderItems.$inferSelect>
}
