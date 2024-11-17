import { NewUser, User } from "../entities/User";
import { ResultTuple } from "../utils/result";

export interface IUserRepository {
    create(user: NewUser): Promise<ResultTuple<User>>;
    findById(id: number): Promise<ResultTuple<User>>;
    findAll(): Promise<ResultTuple<User[]>>;
    update(id: number, user: Partial<User>): Promise<ResultTuple<User>>;
    delete(id: number): Promise<ResultTuple<void>>;
}
