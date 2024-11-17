import 'reflect-metadata';

import type { Product } from "@/domain/entities/Product";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import type { ResultTuple } from "@/domain/utils/result";
import ProductRepository from "@infra/repositories/product.repository";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateProductUseCase {
    constructor(
        @inject(ProductRepository.name)
        private productRepository: IProductRepository
    ) {}

    async execute(id: number, productData: Partial<Product>): Promise<ResultTuple<Product>> {
        return await this.productRepository.update(id, productData);
    }
}

export default UpdateProductUseCase; 
