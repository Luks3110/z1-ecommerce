import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import { DeleteProductUseCase } from '@/application/use-cases/products/delete-product.use-case'
import { Result } from '@/domain/utils/result'

describe('deleteProductUseCase', () => {
  let useCase: DeleteProductUseCase
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

    useCase = new DeleteProductUseCase(mockProductRepository)
  })

  it('should delete a product successfully', async () => {
    mockProductRepository.delete.mockResolvedValue(Result.ok(void 0))

    const [result, error] = await useCase.execute(1)

    expect(error).toBeNull()
    expect(result).toBeUndefined()
    expect(mockProductRepository.delete).toHaveBeenCalledWith(1)
  })

  it('should return error when product is not found', async () => {
    mockProductRepository.delete.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.delete',
    }))

    const [result, error] = await useCase.execute(999)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.delete',
    })
  })
})
