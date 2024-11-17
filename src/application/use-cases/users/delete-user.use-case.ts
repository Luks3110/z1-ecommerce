import 'reflect-metadata';

import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { ResultTuple } from "@/domain/utils/result";
import UserRepository from "@/infrastructure/repositories/user.repository";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteUserUseCase {
    constructor(
        @inject(UserRepository.name)
        private userRepository: IUserRepository
    ) {}

    async execute(id: number): Promise<ResultTuple<void>> {
        return await this.userRepository.delete(id);
    }
}

export default DeleteUserUseCase; 
