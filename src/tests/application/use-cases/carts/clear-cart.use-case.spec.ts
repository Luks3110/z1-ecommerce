import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { ClearCartUseCase } from '@/application/use-cases/carts/clear-cart.use-case'
import { Result } from '@/domain/utils/result'

describe('clearCartUseCase', () => {
  let useCase: ClearCartUseCase
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

    useCase = new ClearCartUseCase(mockCartRepository)
  })

  it('should clear cart successfully', async () => {
    const cartId = 'cart-123'

    mockCartRepository.clear.mockResolvedValue(Result.ok(void 0))

    const [result, error] = await useCase.execute(cartId)

    expect(error).toBeNull()
    expect(result).toBeUndefined()
    expect(mockCartRepository.clear).toHaveBeenCalledWith(cartId)
  })

  it('should return error when cart is not found', async () => {
    const cartId = 'non-existent-cart'

    mockCartRepository.clear.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.clear',
    }))

    const [result, error] = await useCase.execute(cartId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.clear',
    })
  })
})
