import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { FindAllUsersUseCase } from '@/application/use-cases/users/find-all-users.use-case'
import { Result } from '@/domain/utils/result'

describe('findAllUsersUseCase', () => {
  let useCase: FindAllUsersUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new FindAllUsersUseCase(mockUserRepository)
  })

  it('should find all users successfully', async () => {
    const users: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    mockUserRepository.findAll.mockResolvedValue(Result.ok(users))

    const [result, error] = await useCase.execute()

    expect(error).toBeNull()
    expect(result).toEqual(users)
    expect(mockUserRepository.findAll).toHaveBeenCalled()
  })

  it('should return error when database fails', async () => {
    mockUserRepository.findAll.mockResolvedValue(Result.error({
      name: 'DatabaseError',
      message: 'Error fetching users',
      source: 'UserRepository.findAll',
    }))

    const [result, error] = await useCase.execute()

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DatabaseError',
      message: 'Error fetching users',
      source: 'UserRepository.findAll',
    })
  })
})
