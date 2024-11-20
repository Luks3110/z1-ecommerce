import type { Cart, CartItem } from '@/domain/entities/Cart'
import type { Product } from '@/domain/entities/Product'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { CartCreateSchema } from '@/domain/validations/cart.schema'
import { CreateCartUseCase } from '@/application/use-cases/carts/create-cart.use-case'
import { Result } from '@/domain/utils/result'

describe('createCartUseCase', () => {
  let useCase: CreateCartUseCase
  let mockCartRepository: jest.Mocked<ICartRepository>
  let mockProductRepository: jest.Mocked<IProductRepository>

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

    mockProductRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn(),
      findInStock: jest.fn(),
    }

    useCase = new CreateCartUseCase(mockCartRepository, mockProductRepository)
  })

  it('should create a cart with items successfully', async () => {
    const product: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const createCartData: CartCreateSchema = {
      userId: 1,
      items: [{
        productId: product.id,
        quantity: 2,
      }],
    }

    const emptyCart: Cart = {
      id: 'cart-123',
      userId: createCartData.userId,
      items: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    const cartItem: CartItem = {
      productId: product.id,
      quantity: createCartData.items[0].quantity,
      price: product.price,
      name: product.name,
    }

    const cartWithItems: Cart = {
      ...emptyCart,
      items: new Map([[cartItem.productId, cartItem]]),
    }

    mockProductRepository.findById.mockResolvedValue(Result.ok(product))
    mockCartRepository.create.mockResolvedValue(Result.ok(emptyCart))
    mockCartRepository.addItem.mockResolvedValue(Result.ok(cartWithItems))

    const [result, error] = await useCase.execute(createCartData)

    expect(error).toBeNull()
    expect(result).toEqual(cartWithItems)
    expect(mockProductRepository.findById).toHaveBeenCalledWith(product.id)
    expect(mockCartRepository.create).toHaveBeenCalledWith(createCartData.userId)
    expect(mockCartRepository.addItem).toHaveBeenCalledWith('cart-123', cartItem)
  })

  // ... add more tests for validation and error cases
})
