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

const userRoutes = new OpenAPIHono()

userRoutes.openapi(createUserRoute, async (ctx) => {
  const userEntity = ctx.req.valid('json')
  const createUserUseCase = container.resolve(CreateUserUseCase)
  const [user, error] = await createUserUseCase.execute(userEntity)

  if (error) {
    return ctx.json(error, 422)
  }

  return ctx.json(user, 201)
})

userRoutes.openapi(getUserByIdRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const findUserByIdUseCase = container.resolve(FindUserByIdUseCase)
  const [user, error] = await findUserByIdUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.json(user, 200)
})

userRoutes.openapi(getAllUsersRoute, async (ctx) => {
  const findAllUsersUseCase = container.resolve(FindAllUsersUseCase)
  const [users, error] = await findAllUsersUseCase.execute()

  if (error) {
    return ctx.json(error, 500)
  }

  return ctx.json(users, 200)
})

userRoutes.openapi(updateUserRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const userData = ctx.req.valid('json') as Partial<User>
  const updateUserUseCase = container.resolve(UpdateUserUseCase)
  const [user, error] = await updateUserUseCase.execute(id, userData)

  if (error) {
    if (error.name === 'NotFoundError') {
      return ctx.json(error, 404)
    }
    return ctx.json(error, 422)
  }

  return ctx.json(user, 200)
})

userRoutes.openapi(deleteUserRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const deleteUserUseCase = container.resolve(DeleteUserUseCase)
  const [, error] = await deleteUserUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.body(null, 204)
})

export default userRoutes
