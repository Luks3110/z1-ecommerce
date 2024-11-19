import type { Cart } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { FindCartByIdUseCase } from '@/application/use-cases/carts/find-cart-by-id.use-case'
import { Result } from '@/domain/utils/result'

describe('findCartByIdUseCase', () => {
  let useCase: FindCartByIdUseCase
  let mockCartRepository: jest.Mocked<ICartRepository>

  beforeEach(() => {
    mockCartRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateItemQuantity: jest.fn(),
      clear: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new FindCartByIdUseCase(mockCartRepository)
  })

  it('should find a cart by id successfully', async () => {
    const cart: Cart = {
      id: 'cart-123',
      userId: 1,
      items: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.findById.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute('cart-123')

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockCartRepository.findById).toHaveBeenCalledWith('cart-123')
  })

  it('should return error when cart is not found', async () => {
    mockCartRepository.findById.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.findById',
    }))

    const [result, error] = await useCase.execute('non-existent-cart')

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.findById',
    })
  })
})
