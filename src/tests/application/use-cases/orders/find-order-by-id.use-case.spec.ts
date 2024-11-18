import type { Order, OrderItem } from '@/domain/entities/Order'
import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { FindOrderByIdUseCase } from '@/application/use-cases/orders/find-order-by-id.use-case'
import { Result } from '@/domain/utils/result'

describe('findOrderByIdUseCase', () => {
  let useCase: FindOrderByIdUseCase
  let mockOrderRepository: jest.Mocked<IOrderRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new FindOrderByIdUseCase(mockOrderRepository)
  })

  it('should find an order by id successfully', async () => {
    const order: Order & { items: OrderItem[] } = {
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
    }

    mockOrderRepository.findById.mockResolvedValue(Result.ok(order))

    const [result, error] = await useCase.execute(1)

    expect(error).toBeNull()
    expect(result).toEqual(order)
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(1)
  })

  it('should return error when order is not found', async () => {
    mockOrderRepository.findById.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Order not found',
      source: 'OrderRepository.findById',
    }))

    const [result, error] = await useCase.execute(999)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Order not found',
      source: 'OrderRepository.findById',
    })
  })
})
