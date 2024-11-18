import type { IOrderRepository } from '@/domain/repositories/IOrderRepository'
import { DeleteOrderUseCase } from '@/application/use-cases/orders/delete-order.use-case'
import { Result } from '@/domain/utils/result'

describe('deleteOrderUseCase', () => {
  let useCase: DeleteOrderUseCase
  let mockOrderRepository: jest.Mocked<IOrderRepository>

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new DeleteOrderUseCase(mockOrderRepository)
  })

  it('should delete an order successfully', async () => {
    mockOrderRepository.delete.mockResolvedValue(Result.ok(void 0))

    const [result, error] = await useCase.execute(1)

    expect(error).toBeNull()
    expect(result).toBeUndefined()
    expect(mockOrderRepository.delete).toHaveBeenCalledWith(1)
  })

  it('should return error when order is not found', async () => {
    mockOrderRepository.delete.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'Order not found',
      source: 'OrderRepository.delete',
    }))

    const [result, error] = await useCase.execute(999)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'Order not found',
      source: 'OrderRepository.delete',
    })
  })
})
