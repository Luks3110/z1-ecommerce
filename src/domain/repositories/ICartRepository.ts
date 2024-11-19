import type { Cart, CartItem } from '../entities/Cart'
import type { ResultTuple } from '../utils/result'

export interface ICartRepository {
  create: (userId: number) => Promise<ResultTuple<Cart>>
  findById: (id: string) => Promise<ResultTuple<Cart>>
  findByUserId: (userId: number) => Promise<ResultTuple<Cart>>
  addItem: (cartId: string, item: CartItem) => Promise<ResultTuple<Cart>>
  removeItem: (cartId: string, productId: number) => Promise<ResultTuple<Cart>>
  updateItemQuantity: (cartId: string, productId: number, quantity: number) => Promise<ResultTuple<Cart>>
  clear: (cartId: string) => Promise<ResultTuple<void>>
  delete: (cartId: string) => Promise<ResultTuple<void>>
}
