import type { Cart } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { FindCartByUserIdUseCase } from '@/application/use-cases/carts/find-cart-by-user-id.use-case'
import { Result } from '@/domain/utils/result'

describe('findCartByUserIdUseCase', () => {
  let useCase: FindCartByUserIdUseCase
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

    useCase = new FindCartByUserIdUseCase(mockCartRepository)
  })

  it('should find a cart by user id successfully', async () => {
    const userId = 1
    const cart: Cart = {
      id: 'cart-123',
      userId,
      items: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.findByUserId.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(userId)

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockCartRepository.findByUserId).toHaveBeenCalledWith(userId)
  })

  it('should return error when cart is not found', async () => {
    const userId = 999

    mockCartRepository.findByUserId.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.findByUserId',
    }))

    const [result, error] = await useCase.execute(userId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.findByUserId',
    })
  })
})
