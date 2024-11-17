import type { NewProduct, Product } from "../entities/Product";
import type { ResultTuple } from "../utils/result";

export interface IProductRepository {
    create(product: NewProduct): Promise<ResultTuple<Product>>;
    findById(id: number): Promise<ResultTuple<Product>>;
    findAll(): Promise<ResultTuple<Product[]>>;
    update(id: number, product: Partial<Product>): Promise<ResultTuple<Product>>;
    delete(id: number): Promise<ResultTuple<void>>;
    findByName(name: string): Promise<ResultTuple<Product[]>>;
    findInStock(): Promise<ResultTuple<Product[]>>;
} 
