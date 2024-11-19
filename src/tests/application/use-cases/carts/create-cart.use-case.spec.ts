import type { Cart } from '@/domain/entities/Cart'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import { CreateCartUseCase } from '@/application/use-cases/carts/create-cart.use-case'
import { Result } from '@/domain/utils/result'

describe('createCartUseCase', () => {
  let useCase: CreateCartUseCase
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

    useCase = new CreateCartUseCase(mockCartRepository)
  })

  it('should create a cart successfully', async () => {
    const userId = 1
    const cart: Cart = {
      id: 'cart-123',
      userId,
      items: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.create.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(userId)

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockCartRepository.create).toHaveBeenCalledWith(userId)
  })

  it('should return error when creation fails', async () => {
    const userId = 1

    mockCartRepository.create.mockResolvedValue(Result.error({
      name: 'DatabaseError',
      message: 'Error creating cart',
      source: 'CartRepository.create',
    }))

    const [result, error] = await useCase.execute(userId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DatabaseError',
      message: 'Error creating cart',
      source: 'CartRepository.create',
    })
  })
})
