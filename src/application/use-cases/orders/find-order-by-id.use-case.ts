import type { Order, OrderItem } from '@/domain/entities/Order'

import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { OrderRepository } from '@/infrastructure/repositories'
import { inject, injectable } from 'tsyringe'

@injectable()
export class FindOrderByIdUseCase {
  constructor(
    @inject(OrderRepository.name)
    private orderRepository: IOrderRepository,
  ) {}

  async execute(
    id: number,
  ): Promise<ResultTuple<Order & { items: OrderItem[] }>> {
    return await this.orderRepository.findById(id)
  }
}
