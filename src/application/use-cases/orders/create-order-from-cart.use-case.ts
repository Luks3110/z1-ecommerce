import type { CreateOrderData, Order, OrderItem } from '@/domain/entities/Order'

import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { Result } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { OrderRepository } from '@/infrastructure/repositories/order.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class CreateOrderFromCartUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
        @inject(OrderRepository.name)
        private orderRepository: IOrderRepository,
  ) {}

  async execute(cartId: string): Promise<ResultTuple<Order & { items: OrderItem[] }>> {
    const [cart, cartError] = await this.cartRepository.findById(cartId)

    if (cartError) {
      return Result.error({
        name: 'NotFoundError',
        message: 'Cart not found',
        source: 'CreateOrderFromCartUseCase.execute',
      })
    }

    if (cart.items.size === 0) {
      return Result.error({
        name: 'ValidationError',
        message: 'Cart is empty',
        source: 'CreateOrderFromCartUseCase.execute',
      })
    }

    const orderData: CreateOrderData = {
      userId: cart.userId,
      items: Array.from(cart.items.values()).map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtTime: item.price,
      })),
    }

    const [order, orderError] = await this.orderRepository.create(orderData)

    if (orderError) {
      return Result.error(orderError)
    }

    await this.cartRepository.delete(cartId)

    return Result.ok(order)
  }
}
