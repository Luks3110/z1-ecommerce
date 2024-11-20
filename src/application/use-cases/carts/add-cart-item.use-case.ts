import type { Cart, CartItem } from '@/domain/entities/Cart'

import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ResultTuple } from '@/domain/utils/result'
import type { CartCreateItemSchema } from '@/domain/validations/cart.schema'
import { Result } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { ProductRepository } from '@/infrastructure/repositories/product.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class AddCartItemUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
        @inject(ProductRepository.name)
        private productRepository: IProductRepository,
  ) {}

  async execute(cartId: string, itemData: CartCreateItemSchema): Promise<ResultTuple<Cart>> {
    const [product, productError] = await this.productRepository.findById(itemData.productId)

    if (productError) {
      return Result.error({
        name: 'ValidationError',
        message: `Product with id ${itemData.productId} not found`,
        source: 'AddCartItemUseCase.execute',
      })
    }

    if (!product.isAvailable || product.stock < itemData.quantity) {
      return Result.error({
        name: 'ValidationError',
        message: `Product ${product.name} is not available or has insufficient stock`,
        source: 'AddCartItemUseCase.execute',
      })
    }

    const cartItem: CartItem = {
      productId: product.id,
      quantity: itemData.quantity,
      price: product.price,
      name: product.name,
    }

    return await this.cartRepository.addItem(cartId, cartItem)
  }
}
