import type { User } from '@/domain/entities/User'

import { OpenAPIHono } from '@hono/zod-openapi'
import { container } from '@infra/container'
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
  UpdateUserUseCase,
} from '../use-cases/users'
import {
  createUserRoute,
  deleteUserRoute,
  getAllUsersRoute,
  getUserByIdRoute,
  updateUserRoute,
} from './open-api/users'
import 'reflect-metadata'

const userRoutes = new OpenAPIHono()

userRoutes.openapi(createUserRoute, async (c) => {
  const userEntity = c.req.valid('json')
  const createUserUseCase = container.resolve(CreateUserUseCase)
  const [user, error] = await createUserUseCase.execute(userEntity)

  if (error) {
    return c.json(error, 422)
  }

  return c.json(user, 201)
})

userRoutes.openapi(getUserByIdRoute, async (c) => {
  const { id } = c.req.valid('param')
  const findUserByIdUseCase = container.resolve(FindUserByIdUseCase)
  const [user, error] = await findUserByIdUseCase.execute(id)

  if (error) {
    return c.json(error, 404)
  }

  return c.json(user, 200)
})

userRoutes.openapi(getAllUsersRoute, async (c) => {
  const findAllUsersUseCase = container.resolve(FindAllUsersUseCase)
  const [users, error] = await findAllUsersUseCase.execute()

  if (error) {
    return c.json(error, 500)
  }

  return c.json(users, 200)
})

userRoutes.openapi(updateUserRoute, async (c) => {
  const { id } = c.req.valid('param')
  const userData = c.req.valid('json') as Partial<User>
  const updateUserUseCase = container.resolve(UpdateUserUseCase)
  const [user, error] = await updateUserUseCase.execute(id, userData)

  if (error) {
    if (error.name === 'NotFoundError') {
      return c.json(error, 404)
    }
    return c.json(error, 422)
  }

  return c.json(user, 200)
})

userRoutes.openapi(deleteUserRoute, async (c) => {
  const { id } = c.req.valid('param')
  const deleteUserUseCase = container.resolve(DeleteUserUseCase)
  const [, error] = await deleteUserUseCase.execute(id)

  if (error) {
    return c.json(error, 404)
  }

  return c.body(null, 204)
})

export default userRoutes
