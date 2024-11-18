import type {
  CreateOrderData,
  Order,
  OrderItem,
} from '@/domain/entities/Order'

import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import type { ResultTuple } from '@/domain/utils/result'
import OrderRepository from '@/infrastructure/repositories/order.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class CreateOrderUseCase {
  constructor(
    @inject(OrderRepository.name)
    private orderRepository: IOrderRepository,
  ) {}

  async execute(
    orderData: CreateOrderData,
  ): Promise<ResultTuple<Order & { items: OrderItem[] }>> {
    return await this.orderRepository.create(orderData)
  }
}
