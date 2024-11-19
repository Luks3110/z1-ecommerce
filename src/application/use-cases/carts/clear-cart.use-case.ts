import type { ICartRepository } from '@/domain/repositories/ICartRepository'

import type { ResultTuple } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class ClearCartUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
  ) {}

  async execute(cartId: string): Promise<ResultTuple<void>> {
    return await this.cartRepository.clear(cartId)
  }
}
