import type { Cart, CartItem } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { AddCartItemUseCase } from '@/application/use-cases/carts/add-cart-item.use-case'
import { Result } from '@/domain/utils/result'

describe('addCartItemUseCase', () => {
  let useCase: AddCartItemUseCase
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

    useCase = new AddCartItemUseCase(mockCartRepository)
  })

  it('should add item to cart successfully', async () => {
    const cartId = 'cart-123'
    const item: CartItem = {
      productId: 1,
      quantity: 2,
      price: 100,
      name: 'Test Product',
    }

    const cart: Cart = {
      id: cartId,
      userId: 1,
      items: new Map([[item.productId, item]]),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.addItem.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(cartId, item)

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockCartRepository.addItem).toHaveBeenCalledWith(cartId, item)
  })

  it('should return error when cart is not found', async () => {
    const cartId = 'non-existent-cart'
    const item: CartItem = {
      productId: 1,
      quantity: 2,
      price: 100,
      name: 'Test Product',
    }

    mockCartRepository.addItem.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.addItem',
    }))

    const [result, error] = await useCase.execute(cartId, item)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.addItem',
    })
  })
})
