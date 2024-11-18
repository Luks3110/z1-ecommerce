import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { FindUserByIdUseCase } from '@/application/use-cases/users/find-user-by-id.use-case'
import { Result } from '@/domain/utils/result'

describe('findUserByIdUseCase', () => {
  let useCase: FindUserByIdUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new FindUserByIdUseCase(mockUserRepository)
  })

  it('should find a user by id successfully', async () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUserRepository.findById.mockResolvedValue(Result.ok(user))

    const [result, error] = await useCase.execute(1)

    expect(error).toBeNull()
    expect(result).toEqual(user)
    expect(mockUserRepository.findById).toHaveBeenCalledWith(1)
  })

  it('should return error when user is not found', async () => {
    mockUserRepository.findById.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'User not found',
      source: 'UserRepository.findById',
    }))

    const [result, error] = await useCase.execute(999)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'User not found',
      source: 'UserRepository.findById',
    })
  })
})
