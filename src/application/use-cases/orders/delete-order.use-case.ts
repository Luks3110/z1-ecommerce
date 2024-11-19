import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'

import type { ResultTuple } from '@/domain/utils/result'
import { OrderRepository } from '@/infrastructure/repositories'
import { inject, injectable } from 'tsyringe'

@injectable()
export class DeleteOrderUseCase {
  constructor(
    @inject(OrderRepository.name)
    private orderRepository: IOrderRepository,
  ) {}

  async execute(id: number): Promise<ResultTuple<void>> {
    return await this.orderRepository.delete(id)
  }
}
