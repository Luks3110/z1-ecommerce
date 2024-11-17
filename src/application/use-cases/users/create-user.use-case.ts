import 'reflect-metadata';

import { NewUser, User } from "@/domain/entities/User";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import { ResultTuple } from "@/domain/utils/result";
import UserRepository from '@/infrastructure/repositories/user.repository';
import { inject, injectable } from "tsyringe";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject(UserRepository.name)
        private userRepository: IUserRepository
    ) {}

    async execute(user: NewUser): Promise<ResultTuple<User>> {
        return await this.userRepository.create(user);
    }
}

export default CreateUserUseCase;
