import 'reflect-metadata';

import type { User } from "@/domain/entities/User";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { ResultTuple } from "@/domain/utils/result";
import UserRepository from "@infra/repositories/user.repository";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateUserUseCase {
    constructor(
        @inject(UserRepository.name)
        private userRepository: IUserRepository
    ) {}

    async execute(id: number, userData: Partial<User>): Promise<ResultTuple<User>> {
        return await this.userRepository.update(id, userData);
    }
}

export default UpdateUserUseCase; 
