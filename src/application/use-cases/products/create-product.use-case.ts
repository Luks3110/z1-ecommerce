import 'reflect-metadata';

import type { NewProduct, Product } from "@/domain/entities/Product";
import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import type { ResultTuple } from "@/domain/utils/result";
import ProductRepository from '@infra/repositories/product.repository';
import { inject, injectable } from "tsyringe";

@injectable()
class CreateProductUseCase {
    constructor(
        @inject(ProductRepository.name)
        private productRepository: IProductRepository
    ) {}

    async execute(product: NewProduct): Promise<ResultTuple<Product>> {
        return await this.productRepository.create(product);
    }
}

export default CreateProductUseCase; 
