import type { Cart } from '@/domain/entities/Cart'

import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class RemoveCartItemUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
  ) {}

  async execute(cartId: string, productId: number): Promise<ResultTuple<Cart>> {
    return await this.cartRepository.removeItem(cartId, productId)
  }
}
