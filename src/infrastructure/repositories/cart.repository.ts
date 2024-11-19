import type { Cart, CartItem } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { randomUUID } from 'node:crypto'
import { deserializeCart, serializeCart } from '@/domain/entities/Cart'
import { Result } from '@/domain/utils/result'
import Redis from '@/infrastructure/database/redis'
import { inject, injectable } from 'tsyringe'

const CART_PREFIX = 'cart:'
const CART_EXPIRATION = 60 * 60 * 24 * 7 // 7 days in seconds

@injectable()
export class CartRepository implements ICartRepository {
  constructor(
        @inject(Redis.name)
        private readonly redis: Redis,
  ) {}

  public async create(userId: number): Promise<ResultTuple<Cart>> {
    const cartId = randomUUID()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + (CART_EXPIRATION * 1000))

    const cart: Cart = {
      id: cartId,
      userId,
      items: new Map<number, CartItem>(),
      createdAt: now,
      updatedAt: now,
      expiresAt,
    }

    const serializedCart = serializeCart(cart)
    if (!serializedCart) {
      return Result.error({
        name: 'SerializationError',
        message: 'Error serializing cart',
        source: 'CartRepository.create',
      })
    }

    try {
      await this.redis.getClient().set(
        `${CART_PREFIX}${cartId}`,
        serializedCart,
        {
          EX: CART_EXPIRATION,
        },
      )

      return Result.ok(cart)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error creating cart',
        source: 'CartRepository.create',
      })
    }
  }

  public async addItem(cartId: string, item: CartItem): Promise<ResultTuple<Cart>> {
    const [cart, error] = await this.findById(cartId)
    if (error)
      return Result.error(error)

    cart.items.set(item.productId, {
      ...item,
      quantity: (cart.items.get(item.productId)?.quantity || 0) + item.quantity,
    })

    cart.updatedAt = new Date()

    const serializedCart = serializeCart(cart)
    if (!serializedCart) {
      return Result.error({
        name: 'SerializationError',
        message: 'Error serializing cart',
        source: 'CartRepository.addItem',
      })
    }

    try {
      await this.redis.getClient().set(
        `${CART_PREFIX}${cartId}`,
        serializedCart,
        {
          EX: CART_EXPIRATION,
        },
      )

      return Result.ok(cart)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error adding item to cart',
        source: 'CartRepository.addItem',
      })
    }
  }

  public async removeItem(cartId: string, productId: number): Promise<ResultTuple<Cart>> {
    const [cart, error] = await this.findById(cartId)
    if (error)
      return Result.error(error)

    cart.items.delete(productId)
    cart.updatedAt = new Date()

    const serializedCart = serializeCart(cart)
    if (!serializedCart) {
      return Result.error({
        name: 'SerializationError',
        message: 'Error serializing cart',
        source: 'CartRepository.removeItem',
      })
    }
    try {
      await this.redis.getClient().set(
        `${CART_PREFIX}${cartId}`,
        serializedCart,
        {
          EX: CART_EXPIRATION,
        },
      )

      return Result.ok(cart)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error removing item from cart',
        source: 'CartRepository.removeItem',
      })
    }
  }

  public async findById(id: string): Promise<ResultTuple<Cart>> {
    try {
      const cartData = await this.redis.getClient().get(`${CART_PREFIX}${id}`)

      if (!cartData) {
        return Result.error({
          name: 'NotFoundError',
          message: 'Cart not found',
          source: 'CartRepository.findById',
        })
      }

      const cart = deserializeCart(cartData)
      return Result.ok(cart)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error finding cart',
        source: 'CartRepository.findById',
      })
    }
  }

  public async findByUserId(userId: number): Promise<ResultTuple<Cart>> {
    try {
      const keys = await this.redis.getClient().keys(`${CART_PREFIX}*`)

      for (const key of keys) {
        const cartData = await this.redis.getClient().get(key)
        if (cartData) {
          const cart = deserializeCart(cartData)
          if (cart.userId === userId) {
            return Result.ok(cart)
          }
        }
      }

      return Result.error({
        name: 'NotFoundError',
        message: 'Cart not found',
        source: 'CartRepository.findByUserId',
      })
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error finding cart',
        source: 'CartRepository.findByUserId',
      })
    }
  }

  public async updateItemQuantity(cartId: string, productId: number, quantity: number): Promise<ResultTuple<Cart>> {
    try {
      const [cart, error] = await this.findById(cartId)
      if (error)
        return Result.error(error)

      const item = cart.items.get(productId)
      if (!item) {
        return Result.error({
          name: 'NotFoundError',
          message: 'Item not found in cart',
          source: 'CartRepository.updateItemQuantity',
        })
      }

      if (quantity <= 0) {
        return this.removeItem(cartId, productId)
      }

      item.quantity = quantity
      cart.updatedAt = new Date()

      const serializedCart = serializeCart(cart)
      if (!serializedCart) {
        return Result.error({
          name: 'SerializationError',
          message: 'Error serializing cart',
          source: 'CartRepository.updateItemQuantity',
        })
      }

      await this.redis.getClient().set(
        `${CART_PREFIX}${cartId}`,
        serializedCart,
        {
          EX: CART_EXPIRATION,
        },
      )

      return Result.ok(cart)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error updating item quantity',
        source: 'CartRepository.updateItemQuantity',
      })
    }
  }

  public async clear(cartId: string): Promise<ResultTuple<void>> {
    try {
      const [cart, error] = await this.findById(cartId)
      if (error)
        return Result.error(error)

      cart.items.clear()
      cart.updatedAt = new Date()

      const serializedCart = serializeCart(cart)
      if (!serializedCart) {
        return Result.error({
          name: 'SerializationError',
          message: 'Error serializing cart',
          source: 'CartRepository.clear',
        })
      }

      await this.redis.getClient().set(
        `${CART_PREFIX}${cartId}`,
        serializedCart,
        {
          EX: CART_EXPIRATION,
        },
      )

      return Result.ok(void 0)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error clearing cart',
        source: 'CartRepository.clear',
      })
    }
  }

  public async delete(cartId: string): Promise<ResultTuple<void>> {
    try {
      const deleted = await this.redis.getClient().del(`${CART_PREFIX}${cartId}`)

      if (deleted === 0) {
        return Result.error({
          name: 'NotFoundError',
          message: 'Cart not found',
          source: 'CartRepository.delete',
        })
      }

      return Result.ok(void 0)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error deleting cart',
        source: 'CartRepository.delete',
      })
    }
  }
}
