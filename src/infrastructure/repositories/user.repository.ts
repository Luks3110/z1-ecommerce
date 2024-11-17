import type { NewUser, User } from "@/domain/entities/User";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { ResultTuple } from "@/domain/utils/result";
import { Result } from "@/domain/utils/result";
import Neon from "@/infrastructure/database/neon";
import { eq } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import { users } from "../database/schema/users";

@injectable()
export default class UserRepository implements IUserRepository {
    constructor(
        @inject(Neon.name)
        private neon: Neon
    ) {}
    
    async create(user: NewUser): Promise<ResultTuple<User>> {
        try {
            const newUser = await this.neon.drizzle()
                .insert(users)
                .values(user)
                .returning();
            return Result.ok(newUser[0]);
        } catch (error: any) {
            if (error.code === '23505' && error.message.includes('users_email_unique')) {
                return Result.error({
                    name: 'DuplicateEmailError',
                    message: 'Email already exists',
                    source: 'UserRepository.create',
                });
            }
            return Result.error({
                name: 'DatabaseError',
                message: 'Error creating user',
                source: 'UserRepository.create',
            });
        }
    }

    async findById(id: number): Promise<ResultTuple<User>> {
        try {
            const result = await this.neon.drizzle()
                .select()
                .from(users)
                .where(eq(users.id, id));
            
            if (!result[0]) {
                return Result.error({
                    name: 'NotFoundError',
                    message: `User with id ${id} not found`,
                    source: 'UserRepository.findById',
                });
            }
            
            return Result.ok(result[0]);
        } catch (error) {
            return Result.error({
                name: 'DatabaseError',
                message: 'Error finding user',
                source: 'UserRepository.findById',
            });
        }
    }

    async findAll(): Promise<ResultTuple<User[]>> {
        try {
            const result = await this.neon.drizzle()
                .select()
                .from(users);
            return Result.ok(result);
        } catch (error) {
            return Result.error({
                name: 'DatabaseError',
                message: 'Error fetching users',
                source: 'UserRepository.findAll',
            });
        }
    }

    async update(id: number, user: Partial<User>): Promise<ResultTuple<User>> {
        try {
            const updatedUser = await this.neon.drizzle()
                .update(users)
                .set({ 
                    ...user,
                    updatedAt: new Date() 
                })
                .where(eq(users.id, id))
                .returning();

            if (!updatedUser[0]) {
                return Result.error({
                    name: 'NotFoundError',
                    message: `User with id ${id} not found`,
                    source: 'UserRepository.update',
                });
            }

            return Result.ok(updatedUser[0]);
        } catch (error: any) {
            if (error.code === '23505' && error.message.includes('users_email_unique')) {
                return Result.error({
                    name: 'DuplicateEmailError',
                    message: 'Email already exists',
                    source: 'UserRepository.update',
                });
            }
            return Result.error({
                name: 'DatabaseError',
                message: 'Error updating user',
                source: 'UserRepository.update',
            });
        }
    }

    async delete(id: number): Promise<ResultTuple<void>> {
        try {
            const result = await this.neon.drizzle()
                .delete(users)
                .where(eq(users.id, id))
                .returning();
            
            if (!result[0]) {
                return Result.error({
                    name: 'NotFoundError',
                    message: `User with id ${id} not found`,
                    source: 'UserRepository.delete',
                });
            }

            return Result.ok(void 0);
        } catch (error) {
            return Result.error({
                name: 'DatabaseError',
                message: 'Error deleting user',
                source: 'UserRepository.delete',
            });
        }
    }
}
