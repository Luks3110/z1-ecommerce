import type { Product } from '@/domain/entities/Product'

import { OpenAPIHono } from '@hono/zod-openapi'
import { container } from '@infra/container'
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindAllProductsUseCase,
  FindProductByIdUseCase,
  UpdateProductUseCase,
} from '../use-cases/products'
import {
  createProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getProductByIdRoute,
  updateProductRoute,
} from './open-api/products'

const productRoutes = new OpenAPIHono()

productRoutes.openapi(createProductRoute, async (ctx) => {
  const productEntity = ctx.req.valid('json')
  const createProductUseCase = container.resolve(CreateProductUseCase)
  const [product, error] = await createProductUseCase.execute(productEntity)

  if (error) {
    return ctx.json(error, 422)
  }

  return ctx.json(product, 201)
})

productRoutes.openapi(getProductByIdRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const findProductByIdUseCase = container.resolve(FindProductByIdUseCase)
  const [product, error] = await findProductByIdUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.json(product, 200)
})

productRoutes.openapi(getAllProductsRoute, async (ctx) => {
  const findAllProductsUseCase = container.resolve(FindAllProductsUseCase)
  const [products, error] = await findAllProductsUseCase.execute()

  if (error) {
    return ctx.json(error, 500)
  }

  return ctx.json(products, 200)
})

productRoutes.openapi(updateProductRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const productData = ctx.req.valid('json') as Partial<Product>
  const updateProductUseCase = container.resolve(UpdateProductUseCase)
  const [product, error] = await updateProductUseCase.execute(id, productData)

  if (error) {
    if (error.name === 'NotFoundError') {
      return ctx.json(error, 404)
    }
    return ctx.json(error, 422)
  }

  return ctx.json(product, 200)
})

productRoutes.openapi(deleteProductRoute, async (ctx) => {
  const { id } = ctx.req.valid('param')
  const deleteProductUseCase = container.resolve(DeleteProductUseCase)
  const [, error] = await deleteProductUseCase.execute(id)

  if (error) {
    return ctx.json(error, 404)
  }

  return ctx.body(null, 204)
})

export default productRoutes
