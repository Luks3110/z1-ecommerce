import type { User } from '@/domain/entities/User'
import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { UpdateUserUseCase } from '@/application/use-cases/users/update-user.use-case'
import { Result } from '@/domain/utils/result'

describe('updateUserUseCase', () => {
  let useCase: UpdateUserUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new UpdateUserUseCase(mockUserRepository)
  })

  it('should update a user successfully', async () => {
    const userId = 1
    const updateData = {
      name: 'John Updated',
    }

    const updatedUser: User = {
      id: userId,
      name: 'John Updated',
      email: 'john@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUserRepository.update.mockResolvedValue(Result.ok(updatedUser))

    const [result, error] = await useCase.execute(userId, updateData)

    expect(error).toBeNull()
    expect(result).toEqual(updatedUser)
    expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData)
  })

  it('should return error when user is not found', async () => {
    const userId = 999
    const updateData = {
      name: 'John Updated',
    }

    mockUserRepository.update.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'User not found',
      source: 'UserRepository.update',
    }))

    const [result, error] = await useCase.execute(userId, updateData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'User not found',
      source: 'UserRepository.update',
    })
  })

  it('should return error when email already exists', async () => {
    const userId = 1
    const updateData = {
      email: 'existing@example.com',
    }

    mockUserRepository.update.mockResolvedValue(Result.error({
      name: 'DuplicateEmailError',
      message: 'Email already exists',
      source: 'UserRepository.update',
    }))

    const [result, error] = await useCase.execute(userId, updateData)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'DuplicateEmailError',
      message: 'Email already exists',
      source: 'UserRepository.update',
    })
  })
})
