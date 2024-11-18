import type { CreateOrderData } from '@/domain/entities/Order'

import { OpenAPIHono } from '@hono/zod-openapi'
import { container } from '@infra/container'
import {
  CreateOrderUseCase,
  DeleteOrderUseCase,
  FindAllOrdersUseCase,
  FindOrderByIdUseCase,
  FindOrdersByUserIdUseCase,
} from '../use-cases/orders'
import {
  createOrderRoute,
  deleteOrderRoute,
  getAllOrdersRoute,
  getOrderByIdRoute,
  getOrdersByUserIdRoute,
} from './open-api/orders'

const orderRoutes = new OpenAPIHono()

orderRoutes.openapi(createOrderRoute, async (ctx) => {
  const orderData = ctx.req.valid('json') as CreateOrderData
  const createOrderUseCase = container.resolve(CreateOrderUseCase)
  const [order, error] = await createOrderUseCase.execute(orderData)

  if (error) {
    return ctx.json(error, 422)
  }

  return ctx.json(order, 201)
})

orderRoutes.openapi(getOrderByIdRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const findOrderByIdUseCase = container.resolve(FindOrderByIdUseCase)
  const [order, error] = await findOrderByIdUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.json(order, 200)
})

orderRoutes.openapi(getAllOrdersRoute, async (ctx) => {
  const findAllOrdersUseCase = container.resolve(FindAllOrdersUseCase)
  const [orders, error] = await findAllOrdersUseCase.execute()

  if (error) {
    return ctx.json(error, 500)
  }

  return ctx.json(orders, 200)
})

orderRoutes.openapi(getOrdersByUserIdRoute, async (ctx) => {
  const { userId } = ctx.req.valid('param')
  const findOrdersByUserIdUseCase = container.resolve(FindOrdersByUserIdUseCase)
  const [orders, error] = await findOrdersByUserIdUseCase.execute(userId)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.json(orders, 200)
})

orderRoutes.openapi(deleteOrderRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const deleteOrderUseCase = container.resolve(DeleteOrderUseCase)
  const [, error] = await deleteOrderUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.body(null, 204)
})

export default orderRoutes
