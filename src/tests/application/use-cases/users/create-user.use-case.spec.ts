import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { CreateUserUseCase } from '@/application/use-cases/users/create-user.use-case'
import { Result } from '@/domain/utils/result'

describe('createUserUseCase', () => {
  let useCase: CreateUserUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new CreateUserUseCase(mockUserRepository)
  })

  it('should create a user successfully', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
    }

    const createdUser: User = {
      id: 1,
      ...newUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUserRepository.create.mockResolvedValue(Result.ok(createdUser))

    const [result, error] = await useCase.execute(newUser)

    expect(error).toBeNull()
    expect(result).toEqual(createdUser)
    expect(mockUserRepository.create).toHaveBeenCalledWith(newUser)
  })

  it('should return error when email already exists', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'existing@example.com',
    }

    mockUserRepository.create.mockResolvedValue(Result.error({
      name: 'DuplicateEmailError',
      message: 'Email already exists',
      source: 'UserRepository.create',
    }))

    const [result, error] = await useCase.execute(newUser)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DuplicateEmailError',
      message: 'Email already exists',
      source: 'UserRepository.create',
    })
  })
})
