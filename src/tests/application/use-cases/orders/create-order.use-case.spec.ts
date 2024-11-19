import type { CreateOrderData, Order, OrderItem } from '@/domain/entities/Order'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { CreateOrderUseCase } from '@/application/use-cases/orders/create-order.use-case'
import { Result } from '@/domain/utils/result'

describe('createOrderUseCase', () => {
  let useCase: CreateOrderUseCase
  let mockOrderRepository: jest.Mocked<IOrderRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new CreateOrderUseCase(mockOrderRepository)
  })

  it('should create an order successfully', async () => {
    const orderData: CreateOrderData = {
      userId: 1,
      items: [
        {
          productId: 1,
          quantity: 2,
          priceAtTime: 1000,
        },
        {
          productId: 2,
          quantity: 1,
          priceAtTime: 2000,
        },
      ],
    }

    const createdOrder: Order & { items: OrderItem[] } = {
      id: 1,
      userId: 1,
      totalPrice: 300,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: 1,
          orderId: 1,
          productId: 1,
          quantity: 2,
          priceAtTime: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          orderId: 1,
          productId: 2,
          quantity: 1,
          priceAtTime: 2000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    }

    mockOrderRepository.create.mockResolvedValue(Result.ok(createdOrder))

    const [result, error] = await useCase.execute(orderData)

    expect(error).toBeNull()
    expect(result).toEqual(createdOrder)
    expect(mockOrderRepository.create).toHaveBeenCalledWith(orderData)
  })

  it('should return error when product is out of stock', async () => {
    const orderData: CreateOrderData = {
      userId: 1,
      items: [
        {
          productId: 1,
          quantity: 100,
          priceAtTime: 1000,
        },
      ],
    }

    mockOrderRepository.create.mockResolvedValue(Result.error({
      name: 'ValidationError',
      message: 'One or more products are unavailable or have insufficient stock',
      source: 'OrderRepository.create',
    }))

    const [result, error] = await useCase.execute(orderData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'ValidationError',
      message: 'One or more products are unavailable or have insufficient stock',
      source: 'OrderRepository.create',
    })
  })
})
