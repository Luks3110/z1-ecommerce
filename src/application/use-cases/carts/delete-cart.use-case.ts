import type { ICartRepository } from '@/domain/repositories/ICartRepository'

import type { ResultTuple } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class DeleteCartUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
  ) {}

  async execute(cartId: string): Promise<ResultTuple<void>> {
    return await this.cartRepository.delete(cartId)
  }
}
