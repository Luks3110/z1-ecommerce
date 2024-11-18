import type { User } from '@/domain/entities/User'

import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { ResultTuple } from '@/domain/utils/result'
import UserRepository from '@/infrastructure/repositories/user.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject(UserRepository.name)
    private userRepository: IUserRepository,
  ) {}

  async execute(
    id: number,
    userData: Partial<User>,
  ): Promise<ResultTuple<User>> {
    return await this.userRepository.update(id, userData)
  }
}
