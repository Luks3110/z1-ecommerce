import type { Cart } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { UpdateCartItemQuantityUseCase } from '@/application/use-cases/carts/update-cart-item-quantity.use-case'
import { Result } from '@/domain/utils/result'

describe('updateCartItemQuantityUseCase', () => {
  let useCase: UpdateCartItemQuantityUseCase
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

    useCase = new UpdateCartItemQuantityUseCase(mockCartRepository)
  })

  it('should update item quantity successfully', async () => {
    const cartId = 'cart-123'
    const productId = 1
    const quantity = 3
    const cart: Cart = {
      id: cartId,
      userId: 1,
      items: new Map([[productId, {
        productId,
        quantity,
        price: 100,
        name: 'Test Product',
      }]]),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.updateItemQuantity.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(cartId, productId, quantity)

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockCartRepository.updateItemQuantity).toHaveBeenCalledWith(cartId, productId, quantity)
  })

  it('should return error when cart is not found', async () => {
    const cartId = 'non-existent-cart'
    const productId = 1
    const quantity = 3

    mockCartRepository.updateItemQuantity.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.updateItemQuantity',
    }))

    const [result, error] = await useCase.execute(cartId, productId, quantity)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.updateItemQuantity',
    })
  })

  it('should return error when item is not found in cart', async () => {
    const cartId = 'cart-123'
    const productId = 999
    const quantity = 3

    mockCartRepository.updateItemQuantity.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Item not found in cart',
      source: 'CartRepository.updateItemQuantity',
    }))

    const [result, error] = await useCase.execute(cartId, productId, quantity)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Item not found in cart',
      source: 'CartRepository.updateItemQuantity',
    })
  })
})
