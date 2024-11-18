import type { Product } from '@/domain/entities/Product'

import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ResultTuple } from '@/domain/utils/result'
import ProductRepository from '@/infrastructure/repositories/product.repository'
import { inject, injectable } from 'tsyringe'


@injectable()
export class FindAllProductsUseCase {
  constructor(
    @inject(ProductRepository.name)
    private productRepository: IProductRepository,
  ) {}

  async execute(): Promise<ResultTuple<Product[]>> {
    return await this.productRepository.findAll()
  }
}
