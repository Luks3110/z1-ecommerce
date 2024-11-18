import type { Order, OrderItem } from '@/domain/entities/Order'

import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import type { ResultTuple } from '@/domain/utils/result'
import OrderRepository from '@/infrastructure/repositories/order.repository'
import { inject, injectable } from 'tsyringe'


@injectable()
export class FindOrdersByUserIdUseCase {
  constructor(
    @inject(OrderRepository.name)
    private orderRepository: IOrderRepository,
  ) {}

  async execute(
    userId: number,
  ): Promise<ResultTuple<Array<Order & { items: OrderItem[] }>>> {
    return await this.orderRepository.findByUserId(userId)
  }
}
