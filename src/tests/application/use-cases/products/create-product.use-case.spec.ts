import type { Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { CreateProductUseCase } from '@/application/use-cases/products/create-product.use-case'
import { Result } from '@/domain/utils/result'

describe('createProductUseCase', () => {
  let useCase: CreateProductUseCase
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

    useCase = new CreateProductUseCase(mockProductRepository)
  })

  it('should create a product successfully', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isAvailable: true,
    }

    const createdProduct: Product = {
      id: 1,
      ...newProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockProductRepository.create.mockResolvedValue(Result.ok(createdProduct))

    const [result, error] = await useCase.execute(newProduct)

    expect(error).toBeNull()
    expect(result).toEqual(createdProduct)
    expect(mockProductRepository.create).toHaveBeenCalledWith(newProduct)
  })

  it('should return error when creation fails', async () => {
    const newProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isAvailable: true,
    }

    mockProductRepository.create.mockResolvedValue(Result.error({
      name: 'DatabaseError',
      message: 'Error creating product',
      source: 'ProductRepository.create',
    }))

    const [result, error] = await useCase.execute(newProduct)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DatabaseError',
      message: 'Error creating product',
      source: 'ProductRepository.create',
    })
  })
})
