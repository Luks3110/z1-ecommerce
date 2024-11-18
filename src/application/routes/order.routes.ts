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
import 'reflect-metadata'

const orderRoutes = new OpenAPIHono()

orderRoutes.openapi(createOrderRoute, async (c) => {
  const orderData = c.req.valid('json') as CreateOrderData
  const createOrderUseCase = container.resolve(CreateOrderUseCase)
  const [order, error] = await createOrderUseCase.execute(orderData)

  if (error) {
    return c.json(error, 422)
  }

  return c.json(order, 201)
})

orderRoutes.openapi(getOrderByIdRoute, async (c) => {
  const { id } = c.req.valid('param')
  const findOrderByIdUseCase = container.resolve(FindOrderByIdUseCase)
  const [order, error] = await findOrderByIdUseCase.execute(id)

  if (error) {
    return c.json(error, 404)
  }

  return c.json(order, 200)
})

orderRoutes.openapi(getAllOrdersRoute, async (c) => {
  const findAllOrdersUseCase = container.resolve(FindAllOrdersUseCase)
  const [orders, error] = await findAllOrdersUseCase.execute()

  if (error) {
    return c.json(error, 500)
  }

  return c.json(orders, 200)
})

orderRoutes.openapi(getOrdersByUserIdRoute, async (c) => {
  const { userId } = c.req.valid('param')
  const findOrdersByUserIdUseCase = container.resolve(
    FindOrdersByUserIdUseCase,
  )
  const [orders, error] = await findOrdersByUserIdUseCase.execute(userId)

  if (error) {
    return c.json(error, 404)
  }

  return c.json(orders, 200)
})

orderRoutes.openapi(deleteOrderRoute, async (c) => {
  const { id } = c.req.valid('param')
  const deleteOrderUseCase = container.resolve(DeleteOrderUseCase)
  const [, error] = await deleteOrderUseCase.execute(id)

  if (error) {
    return c.json(error, 404)
  }

  return c.body(null, 204)
})

export default orderRoutes
