import type { Cart, CartItem } from '@/domain/entities/Cart'
import type { Product } from '@/domain/entities/Product'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { IProductRepository } from '@/domain/repositories/IProductRepository'
import type { CartCreateItemSchema } from '@/domain/validations/cart.schema'
import { AddCartItemUseCase } from '@/application/use-cases/carts/add-cart-item.use-case'
import { Result } from '@/domain/utils/result'

describe('addCartItemUseCase', () => {
  let useCase: AddCartItemUseCase
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

    useCase = new AddCartItemUseCase(mockCartRepository, mockProductRepository)
  })

  it('should add item to cart successfully', async () => {
    const cartId = 'cart-123'
    const createItemData: CartCreateItemSchema = {
      productId: 1,
      quantity: 2,
    }

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

    const cartItem: CartItem = {
      productId: product.id,
      quantity: createItemData.quantity,
      price: product.price,
      name: product.name,
    }

    const cart: Cart = {
      id: cartId,
      userId: 1,
      items: new Map([[cartItem.productId, cartItem]]),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockProductRepository.findById.mockResolvedValue(Result.ok(product))
    mockCartRepository.addItem.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(cartId, createItemData)

    expect(error).toBeNull()
    expect(result).toEqual(cart)
    expect(mockProductRepository.findById).toHaveBeenCalledWith(createItemData.productId)
    expect(mockCartRepository.addItem).toHaveBeenCalledWith(cartId, cartItem)
  })

  it('should return error when product is not found', async () => {
    const cartId = 'cart-123'
    const createItemData: CartCreateItemSchema = {
      productId: 999,
      quantity: 2,
    }

    mockProductRepository.findById.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Product not found',
      source: 'ProductRepository.findById',
    }))

    const [result, error] = await useCase.execute(cartId, createItemData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'ValidationError',
      message: 'Product with id 999 not found',
      source: 'AddCartItemUseCase.execute',
    })
    expect(mockCartRepository.addItem).not.toHaveBeenCalled()
  })

  it('should return error when product is not available', async () => {
    const cartId = 'cart-123'
    const createItemData: CartCreateItemSchema = {
      productId: 1,
      quantity: 2,
    }

    const product: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      stock: 10,
      isAvailable: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockProductRepository.findById.mockResolvedValue(Result.ok(product))

    const [result, error] = await useCase.execute(cartId, createItemData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'ValidationError',
      message: 'Product Test Product is not available or has insufficient stock',
      source: 'AddCartItemUseCase.execute',
    })
    expect(mockCartRepository.addItem).not.toHaveBeenCalled()
  })

  it('should return error when product has insufficient stock', async () => {
    const cartId = 'cart-123'
    const createItemData: CartCreateItemSchema = {
      productId: 1,
      quantity: 20,
    }

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

    mockProductRepository.findById.mockResolvedValue(Result.ok(product))

    const [result, error] = await useCase.execute(cartId, createItemData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'ValidationError',
      message: 'Product Test Product is not available or has insufficient stock',
      source: 'AddCartItemUseCase.execute',
    })
    expect(mockCartRepository.addItem).not.toHaveBeenCalled()
  })
})
