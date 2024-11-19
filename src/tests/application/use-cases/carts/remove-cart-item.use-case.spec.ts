import type { Cart, CartItem } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { RemoveCartItemUseCase } from '@/application/use-cases/carts/remove-cart-item.use-case'
import { Result } from '@/domain/utils/result'

describe('removeCartItemUseCase', () => {
  let useCase: RemoveCartItemUseCase
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

    useCase = new RemoveCartItemUseCase(mockCartRepository)
  })

  it('should remove item from cart successfully', async () => {
    const cartId = 'cart-123'
    const productId = 1
    const cart: Cart = {
      id: cartId,
      userId: 1,
      items: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.removeItem.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(cartId, productId)

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockCartRepository.removeItem).toHaveBeenCalledWith(cartId, productId)
  })

  it('should return error when cart is not found', async () => {
    const cartId = 'non-existent-cart'
    const productId = 1

    mockCartRepository.removeItem.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.removeItem',
    }))

    const [result, error] = await useCase.execute(cartId, productId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.removeItem',
    })
  })
})
