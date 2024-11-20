import { safeParseJson, safeStringify } from '../utils'

export interface CartItem {
  productId: number
  quantity: number
  price: number
  name: string
}

export interface Cart {
  id: string
  userId: number
  items: Map<number, CartItem>
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export function serializeCart(cart: Cart): string | null {
  return safeStringify({
    ...cart,
    items: Array.from(cart.items.entries()),
  })
}

export function deserializeCart(cartData: string): Cart {
  const parsed = safeParseJson<Cart>(cartData)

  if (!parsed) {
    throw new Error('Invalid cart data')
  }

  return {
    ...parsed,
    items: new Map(parsed.items),
    createdAt: new Date(parsed.createdAt),
    updatedAt: new Date(parsed.updatedAt),
    expiresAt: new Date(parsed.expiresAt),
  }
}
