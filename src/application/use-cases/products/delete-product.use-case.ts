import 'reflect-metadata';

import type { IProductRepository } from "@/domain/repositories/IProductRepository";
import type { ResultTuple } from "@/domain/utils/result";
import ProductRepository from "@/infrastructure/repositories/product.repository";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteProductUseCase {
    constructor(
        @inject(ProductRepository.name)
        private productRepository: IProductRepository
    ) {}

    async execute(id: number): Promise<ResultTuple<void>> {
        return await this.productRepository.delete(id);
    }
}

export default DeleteProductUseCase; 