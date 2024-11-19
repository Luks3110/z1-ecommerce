import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { DeleteCartUseCase } from '@/application/use-cases/carts/delete-cart.use-case'
import { Result } from '@/domain/utils/result'

describe('deleteCartUseCase', () => {
  let useCase: DeleteCartUseCase
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

    useCase = new DeleteCartUseCase(mockCartRepository)
  })

  it('should delete cart successfully', async () => {
    const cartId = 'cart-123'

    mockCartRepository.delete.mockResolvedValue(Result.ok(void 0))

    const [result, error] = await useCase.execute(cartId)

    expect(error).toBeNull()
    expect(result).toBeUndefined()
    expect(mockCartRepository.delete).toHaveBeenCalledWith(cartId)
  })

  it('should return error when cart is not found', async () => {
    const cartId = 'non-existent-cart'

    mockCartRepository.delete.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.delete',
    }))

    const [result, error] = await useCase.execute(cartId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.delete',
    })
  })
})
