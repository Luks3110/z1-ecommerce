import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import { DeleteUserUseCase } from '@/application/use-cases/users/delete-user.use-case'
import { Result } from '@/domain/utils/result'

describe('deleteUserUseCase', () => {
  let useCase: DeleteUserUseCase
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }

    useCase = new DeleteUserUseCase(mockUserRepository)
  })

  it('should delete a user successfully', async () => {
    mockUserRepository.delete.mockResolvedValue(Result.ok(void 0))

    const [result, error] = await useCase.execute(1)

    expect(error).toBeNull()
    expect(result).toBeUndefined()
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1)
  })

  it('should return error when user is not found', async () => {
    mockUserRepository.delete.mockResolvedValue(Result.error({
      name: 'NotFoundError',
      message: 'User not found',
      source: 'UserRepository.delete',
    }))

    const [result, error] = await useCase.execute(999)

    expect(result).toBeNull()
    expect(error).toEqual({
      name: 'NotFoundError',
      message: 'User not found',
      source: 'UserRepository.delete',
    })
  })
})
