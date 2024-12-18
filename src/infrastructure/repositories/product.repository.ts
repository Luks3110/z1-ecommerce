import type { NewProduct, Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { ResultTuple } from '@/domain/utils/result'
import { Result } from '@/domain/utils/result'
import Database from '@/infrastructure/database/db'
import { eq } from 'drizzle-orm'
import { inject, injectable } from 'tsyringe'
import { products } from '../database/schema/products'

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject(Database.name)
    private db: Database,
  ) {}

  async create(product: NewProduct): Promise<ResultTuple<Product>> {
    try {
      const newProduct = await this.db
        .drizzle()
        .insert(products)
        .values(product)
        .returning()
      return Result.ok(newProduct[0])
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error creating product',
        source: 'ProductRepository.create',
      })
    }
  }

  async findById(id: number): Promise<ResultTuple<Product>> {
    try {
      const result = await this.db
        .drizzle()
        .select()
        .from(products)
        .where(eq(products.id, id))

      if (!result[0]) {
        return Result.error({
          name: 'NotFoundError',
          message: `Product with id ${id} not found`,
          source: 'ProductRepository.findById',
        })
      }

      return Result.ok(result[0])
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error finding product',
        source: 'ProductRepository.findById',
      })
    }
  }

  async findAll(): Promise<ResultTuple<Product[]>> {
    try {
      const result = await this.db.drizzle().select().from(products)
      return Result.ok(result)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error fetching products',
        source: 'ProductRepository.findAll',
      })
    }
  }

  async update(
    id: number,
    product: Partial<Product>,
  ): Promise<ResultTuple<Product>> {
    try {
      const updatedProduct = await this.db
        .drizzle()
        .update(products)
        .set({
          ...product,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning()

      if (!updatedProduct[0]) {
        return Result.error({
          name: 'NotFoundError',
          message: `Product with id ${id} not found`,
          source: 'ProductRepository.update',
        })
      }

      return Result.ok(updatedProduct[0])
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error updating product',
        source: 'ProductRepository.update',
      })
    }
  }

  async delete(id: number): Promise<ResultTuple<void>> {
    try {
      const result = await this.db
        .drizzle()
        .delete(products)
        .where(eq(products.id, id))
        .returning()

      if (!result[0]) {
        return Result.error({
          name: 'NotFoundError',
          message: `Product with id ${id} not found`,
          source: 'ProductRepository.delete',
        })
      }

      return Result.ok(void 0)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error deleting product',
        source: 'ProductRepository.delete',
      })
    }
  }

  async findByName(name: string): Promise<ResultTuple<Product[]>> {
    try {
      const result = await this.db
        .drizzle()
        .select()
        .from(products)
        .where(eq(products.name, name))
      return Result.ok(result)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error finding products by name',
        source: 'ProductRepository.findByName',
      })
    }
  }

  async findInStock(): Promise<ResultTuple<Product[]>> {
    try {
      const result = await this.db
        .drizzle()
        .select()
        .from(products)
        .where(eq(products.isAvailable, true))
      return Result.ok(result)
    }
    catch {
      return Result.error({
        name: 'DatabaseError',
        message: 'Error finding in-stock products',
        source: 'ProductRepository.findInStock',
      })
    }
  }
}
