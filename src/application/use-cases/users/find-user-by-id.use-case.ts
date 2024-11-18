import type { User } from '@/domain/entities/User'

import type { IUserRepository } from '@/domain/repositories/IUserRepository'
import type { ResultTuple } from '@/domain/utils/result'
import UserRepository from '@/infrastructure/repositories/user.repository'
import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'

@injectable()
export class FindUserByIdUseCase {
  constructor(
    @inject(UserRepository.name)
    private userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<ResultTuple<User>> {
    return await this.userRepository.findById(id)
  }
}
