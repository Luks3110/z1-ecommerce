import type { Cart, CartItem } from '@/domain/entities/Cart'
import type { CreateOrderData, Order, OrderItem } from '@/domain/entities/Order'
import type { ICartRepository } from '@/domain/repositories/ICartRepository'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { CreateOrderFromCartUseCase } from '@/application/use-cases/orders/create-order-from-cart.use-case'
import { Result } from '@/domain/utils/result'

describe('createOrderFromCartUseCase', () => {
  let useCase: CreateOrderFromCartUseCase
  let mockCartRepository: jest.Mocked<ICartRepository>
  let mockOrderRepository: jest.Mocked<IOrderRepository>

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

    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new CreateOrderFromCartUseCase(mockCartRepository, mockOrderRepository)
  })

  it('should create order from cart successfully', async () => {
    const cartId = 'cart-123'
    const userId = 1
    const cartItem: CartItem = {
      productId: 1,
      quantity: 2,
      price: 100,
      name: 'Test Product',
    }

    const cart: Cart = {
      id: cartId,
      userId,
      items: new Map([[cartItem.productId, cartItem]]),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    const orderData: CreateOrderData = {
      userId,
      items: [{
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtTime: cartItem.price,
      }],
    }

    const order: Order & { items: OrderItem[] } = {
      id: 1,
      userId,
      totalPrice: 200,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [{
        id: 1,
        orderId: 1,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        priceAtTime: cartItem.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
    }

    mockCartRepository.findById.mockResolvedValue(Result.ok(cart))
    mockOrderRepository.create.mockResolvedValue(Result.ok(order))
    mockCartRepository.delete.mockResolvedValue(Result.ok(void 0))

    const [result, error] = await useCase.execute(cartId)

    expect(error).toBeNull()
    expect(result).toEqual(order)
    expect(mockCartRepository.findById).toHaveBeenCalledWith(cartId)
    expect(mockOrderRepository.create).toHaveBeenCalledWith(orderData)
    expect(mockCartRepository.delete).toHaveBeenCalledWith(cartId)
  })

  it('should return error when cart is not found', async () => {
    const cartId = 'non-existent-cart'

    mockCartRepository.findById.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CartRepository.findById',
    }))

    const [result, error] = await useCase.execute(cartId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Cart not found',
      source: 'CreateOrderFromCartUseCase.execute',
    })
    expect(mockOrderRepository.create).not.toHaveBeenCalled()
    expect(mockCartRepository.delete).not.toHaveBeenCalled()
  })

  it('should return error when cart is empty', async () => {
    const cartId = 'cart-123'
    const cart: Cart = {
      id: cartId,
      userId: 1,
      items: new Map(),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.findById.mockResolvedValue(Result.ok(cart))

    const [result, error] = await useCase.execute(cartId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'ValidationError',
      message: 'Cart is empty',
      source: 'CreateOrderFromCartUseCase.execute',
    })
    expect(mockOrderRepository.create).not.toHaveBeenCalled()
    expect(mockCartRepository.delete).not.toHaveBeenCalled()
  })

  it('should return error when order creation fails', async () => {
    const cartId = 'cart-123'
    const userId = 1
    const cartItem: CartItem = {
      productId: 1,
      quantity: 2,
      price: 100,
      name: 'Test Product',
    }

    const cart: Cart = {
      id: cartId,
      userId,
      items: new Map([[cartItem.productId, cartItem]]),
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    mockCartRepository.findById.mockResolvedValue(Result.ok(cart))
    mockOrderRepository.create.mockResolvedValue(Result.error({
      name: 'ValidationError',
      message: 'Insufficient stock',
      source: 'OrderRepository.create',
    }))

    const [result, error] = await useCase.execute(cartId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'ValidationError',
      message: 'Insufficient stock',
      source: 'OrderRepository.create',
    })
    expect(mockCartRepository.delete).not.toHaveBeenCalled()
  })
})
