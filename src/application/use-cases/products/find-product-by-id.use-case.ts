import type { Product } from '@/domain/entities/Product'

import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ResultTuple } from '@/domain/utils/result'
import ProductRepository from '@/infrastructure/repositories/product.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class FindProductByIdUseCase {
  constructor(
    @inject(ProductRepository.name)
    private productRepository: IProductRepository,
  ) {}

  async execute(id: number): Promise<ResultTuple<Product>> {
    return await this.productRepository.findById(id)
  }
}
