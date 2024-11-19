import type { Cart, CartItem } from '@/domain/entities/Cart'

import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class AddCartItemUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
  ) {}

  async execute(cartId: string, item: CartItem): Promise<ResultTuple<Cart>> {
    return await this.cartRepository.addItem(cartId, item)
  }
}
