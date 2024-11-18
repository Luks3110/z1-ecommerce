import type { Order, OrderItem } from '@/domain/entities/Order'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { FindOrdersByUserIdUseCase } from '@/application/use-cases/orders/find-orders-by-user-id.use-case'
import { Result } from '@/domain/utils/result'

describe('findOrdersByUserIdUseCase', () => {
  let useCase: FindOrdersByUserIdUseCase
  let mockOrderRepository: jest.Mocked<IOrderRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new FindOrdersByUserIdUseCase(mockOrderRepository)
  })

  it('should find orders by user id successfully', async () => {
    const userId = 1
    const orders: Array<Order & { items: OrderItem[] }> = [
      {
        id: 1,
        userId,
        totalPrice: 300,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 1,
            orderId: 1,
            productId: 1,
            quantity: 2,
            priceAtTime: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: 2,
        userId,
        totalPrice: 200,
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: 2,
            orderId: 2,
            productId: 2,
            quantity: 1,
            priceAtTime: 200,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    ]

    mockOrderRepository.findByUserId.mockResolvedValue(Result.ok(orders))

    const [result, error] = await useCase.execute(userId)

    expect(error).toBeNull()
    expect(result).toEqual(orders)
    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(userId)
  })

  it('should return empty array when user has no orders', async () => {
    const userId = 999
    mockOrderRepository.findByUserId.mockResolvedValue(Result.ok([]))

    const [result, error] = await useCase.execute(userId)

    expect(error).toBeNull()
    expect(result).toEqual([])
    expect(mockOrderRepository.findByUserId).toHaveBeenCalledWith(userId)
  })

  it('should return error when database fails', async () => {
    const userId = 1
    mockOrderRepository.findByUserId.mockResolvedValue(Result.error({
      name: 'DatabaseError',
      message: 'Error fetching user orders',
      source: 'OrderRepository.findByUserId',
    }))

    const [result, error] = await useCase.execute(userId)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DatabaseError',
      message: 'Error fetching user orders',
      source: 'OrderRepository.findByUserId',
    })
  })
})
