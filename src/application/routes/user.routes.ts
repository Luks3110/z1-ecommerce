import 'reflect-metadata';

import type { User } from '@/domain/entities/User';
import { applicationErrorSchema } from '@/domain/validations/applicationError.schema';
import { userCreateSchema, userSchema, userUpdateSchema } from "@domain/validations/user.schema";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from '@infra/container';
import CreateUserUseCase from "../use-cases/users/create-user.use-case";
import DeleteUserUseCase from '../use-cases/users/delete-user.use-case';
import FindAllUsersUseCase from '../use-cases/users/find-all-users.use-case';
import FindUserByIdUseCase from '../use-cases/users/find-user-by-id.use-case';
import UpdateUserUseCase from '../use-cases/users/update-user.use-case';

const userRoutes = new OpenAPIHono();

const createUserRoute = createRoute({
    method: 'post',
    path: '/',
    tags: ['Users'],
    summary: 'Create a new user',
    request: {
        body: {
            content: {
                "application/json": {
                    schema: userCreateSchema
                }
            }
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
            description: 'User created successfully',
        },
        422: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'Validation error',
        }
    },
});

const getUserByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Users'],
    summary: 'Get user by ID',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        })
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
            description: 'User found',
        },
        404: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'User not found',
        }
    },
});

const getAllUsersRoute = createRoute({
    method: 'get',
    path: '/',
    tags: ['Users'],
    summary: 'Get all users',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(userSchema),
                },
            },
            description: 'List of users',
        },
        500: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'Server error',
        }
    },
});

const updateUserRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Users'],
    summary: 'Update user',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        }),
        body: {
            content: {
                "application/json": {
                    schema: userUpdateSchema
                }
            }
        },
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
            description: 'User updated successfully',
        },
        404: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'User not found',
        },
        422: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'Validation error',
        }
    },
});

const deleteUserRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Users'],
    summary: 'Delete user',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        })
    },
    responses: {
        204: {
            description: 'User deleted successfully',
        },
        404: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'User not found',
        }
    },
});

userRoutes.openapi(createUserRoute, async (c) => {
    const userEntity = c.req.valid('json');
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const [user, error] = await createUserUseCase.execute(userEntity);

    if (error) {
        return c.json(error, 422);
    }

    return c.json(user, 201);
});

userRoutes.openapi(getUserByIdRoute, async (c) => {
    const { id } = c.req.valid('param');
    const findUserByIdUseCase = container.resolve(FindUserByIdUseCase);
    const [user, error] = await findUserByIdUseCase.execute(id);

    if (error) {
        return c.json(error, 404);
    }

    return c.json(user, 200);
});

userRoutes.openapi(getAllUsersRoute, async (c) => {
    const findAllUsersUseCase = container.resolve(FindAllUsersUseCase);
    const [users, error] = await findAllUsersUseCase.execute();

    if (error) {
        return c.json(error, 500);
    }

    return c.json(users, 200);
});

userRoutes.openapi(updateUserRoute, async (c) => {
    const { id } = c.req.valid('param');
    const userData = c.req.valid('json') as Partial<User>;
    const updateUserUseCase = container.resolve(UpdateUserUseCase);
    const [user, error] = await updateUserUseCase.execute(id, userData);

    if (error) {
        if (error.name === 'NotFoundError') {
            return c.json(error, 404);
        }
        return c.json(error, 422);
    }

    return c.json(user, 200);
});

userRoutes.openapi(deleteUserRoute, async (c) => {
    const { id } = c.req.valid('param');
    const deleteUserUseCase = container.resolve(DeleteUserUseCase);
    const [, error] = await deleteUserUseCase.execute(id);

    if (error) {
        return c.json(error, 404);
    }

    return c.body(null, 204);
});

export default userRoutes;
