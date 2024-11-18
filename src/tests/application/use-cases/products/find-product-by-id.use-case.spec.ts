import type { Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { FindProductByIdUseCase } from '@/application/use-cases/products'
import { Result } from '@/domain/utils/result'

describe('findProductByIdUseCase', () => {
  let useCase: FindProductByIdUseCase
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

    useCase = new FindProductByIdUseCase(mockProductRepository)
  })

  it('should find a product by id successfully', async () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockProductRepository.findById.mockResolvedValue(Result.ok(product))

    const [result, error] = await useCase.execute(1)

    expect(error).toBeNull()
    expect(result).toEqual(product)
    expect(mockProductRepository.findById).toHaveBeenCalledWith(1)
  })

  it('should return error when product is not found', async () => {
    mockProductRepository.findById.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.findById',
    }))

    const [result, error] = await useCase.execute(999)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.findById',
    })
  })
})
