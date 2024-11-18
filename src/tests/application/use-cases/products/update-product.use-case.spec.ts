import type { Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { UpdateProductUseCase } from '@/application/use-cases/products/update-product.use-case'
import { Result } from '@/domain/utils/result'

describe('updateProductUseCase', () => {
  let useCase: UpdateProductUseCase
  let mockProductRepository: jest.Mocked<IProductRepository>

  beforeEach(() => {
    mockProductRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
      findInStock: jest.fn(),
    }

    useCase = new UpdateProductUseCase(mockProductRepository)
  })

  it('should update a product successfully', async () => {
    const productId = 1
    const updateData: Partial<Product> = {
      name: 'Updated Product',
      price: 150,
    }

    const updatedProduct: Product = {
      id: productId,
      name: 'Updated Product',
      description: 'Original Description',
      price: 150,
      stock: 10,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockProductRepository.update.mockResolvedValue(Result.ok(updatedProduct))

    const [result, error] = await useCase.execute(productId, updateData)

    expect(error).toBeNull()
    expect(result).toEqual(updatedProduct)
    expect(mockProductRepository.update).toHaveBeenCalledWith(productId, updateData)
  })

  it('should return error when product is not found', async () => {
    const productId = 999
    const updateData: Partial<Product> = {
      name: 'Updated Product',
    }

    mockProductRepository.update.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.update',
    }))

    const [result, error] = await useCase.execute(productId, updateData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.update',
    })
  })
})
