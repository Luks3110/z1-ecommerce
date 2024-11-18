import type { Product } from '@/domain/entities/Product'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { FindAllProductsUseCase } from '@/application/use-cases/products'
import { Result } from '@/domain/utils/result'

describe('findAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase
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

    useCase = new FindAllProductsUseCase(mockProductRepository)
  })

  it('should find all products successfully', async () => {
    const products: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 100,
        stock: 10,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Test Product 2',
        description: 'Test Description 2',
        price: 200,
        stock: 20,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockProductRepository.findAll.mockResolvedValue(Result.ok(products))

    const [result, error] = await useCase.execute()

    expect(error).toBeNull()
    expect(result).toEqual(products)
    expect(mockProductRepository.findAll).toHaveBeenCalled()
  })

  it('should return error when database fails', async () => {
    mockProductRepository.findAll.mockResolvedValue(Result.error({
      name: 'DatabaseError',
      message: 'Error fetching products',
      source: 'ProductRepository.findAll',
    }))

    const [result, error] = await useCase.execute()

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DatabaseError',
      message: 'Error fetching products',
      source: 'ProductRepository.findAll',
    })
  })
})
