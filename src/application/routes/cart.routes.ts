import type { CartItem } from '@/domain/entities/Cart'
import { container } from '@/infrastructure/container'
import { OpenAPIHono } from '@hono/zod-openapi'
import {
  AddCartItemUseCase,
  ClearCartUseCase,
  CreateCartUseCase,
  DeleteCartUseCase,
  FindCartByIdUseCase,
  FindCartByUserIdUseCase,
  RemoveCartItemUseCase,
  UpdateCartItemQuantityUseCase,
} from '../use-cases/carts'
import {
  addItemRoute,
  clearCartRoute,
  createCartRoute,
  deleteCartRoute,
  getCartByIdRoute,
  getCartByUserIdRoute,
  removeItemRoute,
  updateQuantityRoute,
} from './open-api/carts'

const cartRoutes = new OpenAPIHono()

cartRoutes.openapi(createCartRoute, async (ctx) => {
  const { userId, items } = ctx.req.valid('json')
  const createCartUseCase = container.resolve(CreateCartUseCase)
  const [cart, error] = await createCartUseCase.execute({ userId, items })

  if (error) {
    return ctx.json(error, 422)
  }

  const response = {
    ...cart,
    items: Array.from(cart.items.values()),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    expiresAt: cart.expiresAt.toISOString(),
  }

  return ctx.json(response, 201)
})

cartRoutes.openapi(getCartByIdRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const findCartByIdUseCase = container.resolve(FindCartByIdUseCase)
  const [cart, error] = await findCartByIdUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  const response = {
    ...cart,
    items: Array.from(cart.items.values()),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    expiresAt: cart.expiresAt.toISOString(),
  }

  return ctx.json(response, 200)
})

cartRoutes.openapi(getCartByUserIdRoute, async (ctx) => {
  const { userId } = ctx.req.valid('param')
  const findCartByUserIdUseCase = container.resolve(FindCartByUserIdUseCase)
  const [cart, error] = await findCartByUserIdUseCase.execute(userId)

  if (error) {
    return ctx.json(error, 404)
  }

  const response = {
    ...cart,
    items: Array.from(cart.items.values()),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    expiresAt: cart.expiresAt.toISOString(),
  }

  return ctx.json(response, 200)
})

cartRoutes.openapi(addItemRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const itemData = ctx.req.valid('json')
  const addCartItemUseCase = container.resolve(AddCartItemUseCase)
  const [cart, error] = await addCartItemUseCase.execute(id, itemData)

  if (error) {
    return ctx.json(error, 404)
  }

  const response = {
    ...cart,
    items: Array.from(cart.items.values()),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    expiresAt: cart.expiresAt.toISOString(),
  }

  return ctx.json(response, 200)
})

cartRoutes.openapi(removeItemRoute, async (ctx) => {
  const { id, productId } = ctx.req.valid('param')
  const removeCartItemUseCase = container.resolve(RemoveCartItemUseCase)
  const [cart, error] = await removeCartItemUseCase.execute(id, productId)

  if (error) {
    return ctx.json(error, 404)
  }

  const response = {
    ...cart,
    items: Array.from(cart.items.values()),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    expiresAt: cart.expiresAt.toISOString(),
  }

  return ctx.json(response, 200)
})

cartRoutes.openapi(updateQuantityRoute, async (ctx) => {
  const { id, productId } = ctx.req.valid('param')
  const { quantity } = ctx.req.valid('json')
  const updateCartItemQuantityUseCase = container.resolve(UpdateCartItemQuantityUseCase)
  const [cart, error] = await updateCartItemQuantityUseCase.execute(id, productId, quantity)

  if (error) {
    return ctx.json(error, 404)
  }

  const response = {
    ...cart,
    items: Array.from(cart.items.values()),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    expiresAt: cart.expiresAt.toISOString(),
  }

  return ctx.json(response, 200)
})

cartRoutes.openapi(clearCartRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const clearCartUseCase = container.resolve(ClearCartUseCase)
  const [, error] = await clearCartUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.body(null, 204)
})

cartRoutes.openapi(deleteCartRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const deleteCartUseCase = container.resolve(DeleteCartUseCase)
  const [, error] = await deleteCartUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.body(null, 204)
})

export default cartRoutes
