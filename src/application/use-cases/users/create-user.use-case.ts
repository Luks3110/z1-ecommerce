import 'reflect-metadata';

import type { NewUser, User } from "@/domain/entities/User";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { ResultTuple } from "@/domain/utils/result";
import UserRepository from '@/infrastructure/repositories/user.repository';
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject(UserRepository.name)
        private userRepository: IUserRepository
    ) {}

    async execute(user: NewUser): Promise<ResultTuple<User>> {
        return await this.userRepository.create(user);
    }
}
