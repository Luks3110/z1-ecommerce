import type { Cart } from '@/domain/entities/Cart'

import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ResultTuple } from '@/domain/utils/result'
import type { CartCreateSchema } from '@/domain/validations/cart.schema'
import { Result } from '@/domain/utils/result'
import { CartRepository } from '@/infrastructure/repositories/cart.repository'
import { ProductRepository } from '@/infrastructure/repositories/product.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class CreateCartUseCase {
  constructor(
        @inject(CartRepository.name)
        private cartRepository: ICartRepository,
        @inject(ProductRepository.name)
        private productRepository: IProductRepository,
  ) {}

  async execute(data: CartCreateSchema): Promise<ResultTuple<Cart>> {
    // Fetch all products first to validate they exist and are available
    const productIds = data.items.map(item => item.productId)
    const productsResult = await Promise.all(
      productIds.map(id => this.productRepository.findById(id)),
    )

    // Check if any products were not found or are unavailable
    for (let i = 0; i < productsResult.length; i++) {
      const [product, error] = productsResult[i]
      if (error) {
        return Result.error({
          name: 'ValidationError',
          message: `Product with id ${productIds[i]} not found`,
          source: 'CreateCartUseCase.execute',
        })
      }
      if (!product.isAvailable || product.stock < data.items[i].quantity) {
        return Result.error({
          name: 'ValidationError',
          message: `Product ${product.name} is not available or has insufficient stock`,
          source: 'CreateCartUseCase.execute',
        })
      }
    }

    const [cart, cartError] = await this.cartRepository.create(data.userId)

    if (cartError) {
      return Result.error(cartError)
    }

    for (let i = 0; i < data.items.length; i++) {
      const [product, error] = productsResult[i]

      if (error) {
        return Result.error(error)
      }

      const [updatedCart, addError] = await this.cartRepository.addItem(cart.id, {
        productId: product.id,
        quantity: data.items[i].quantity,
        price: product.price,
        name: product.name,
      })

      if (addError) {
        // If adding items fails, delete the cart
        await this.cartRepository.delete(cart.id)
        return Result.error(addError)
      }
      cart.items = updatedCart.items
    }

    return Result.ok(cart)
  }
}
