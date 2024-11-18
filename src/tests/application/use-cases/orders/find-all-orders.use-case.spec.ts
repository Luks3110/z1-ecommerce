import type { Order, OrderItem } from '@/domain/entities/Order'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { FindAllOrdersUseCase } from '@/application/use-cases/orders/find-all-orders.use-case'
import { Result } from '@/domain/utils/result'

describe('findAllOrdersUseCase', () => {
  let useCase: FindAllOrdersUseCase
  let mockOrderRepository: jest.Mocked<IOrderRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new FindAllOrdersUseCase(mockOrderRepository)
  })

  it('should find all orders successfully', async () => {
    const orders: Array<Order & { items: OrderItem[] }> = [
      {
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
            priceAtTime: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
      {
        id: 2,
        userId: 2,
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

    mockOrderRepository.findAll.mockResolvedValue(Result.ok(orders))

    const [result, error] = await useCase.execute()

    expect(error).toBeNull()
    expect(result).toEqual(orders)
    expect(mockOrderRepository.findAll).toHaveBeenCalled()
  })

  it('should return error when database fails', async () => {
    mockOrderRepository.findAll.mockResolvedValue(Result.error({
      name: 'DatabaseError',
      message: 'Error fetching orders',
      source: 'OrderRepository.findAll',
    }))

    const [result, error] = await useCase.execute()

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DatabaseError',
      message: 'Error fetching orders',
      source: 'OrderRepository.findAll',
    })
  })
})
