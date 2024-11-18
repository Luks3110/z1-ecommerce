import { applicationErrorSchema } from '@/domain/validations/applicationError.schema'
import {
  productCreateSchema,
  productSchema,
  productUpdateSchema,
} from '@/domain/validations/product.schema'
import { createRoute, z } from '@hono/zod-openapi'

const createProductRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Products'],
  summary: 'Create a new product',
  request: {
    body: {
      content: {
        'application/json': {
          schema: productCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: productSchema,
        },
      },
      description: 'Product created successfully',
    },
    422: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Validation error',
    },
  },
})

const getProductByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Products'],
  summary: 'Get product by ID',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: productSchema,
        },
      },
      description: 'Product found',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Product not found',
    },
  },
})

const getAllProductsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Products'],
  summary: 'Get all products',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(productSchema),
        },
      },
      description: 'List of products',
    },
    500: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Server error',
    },
  },
})

const updateProductRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Products'],
  summary: 'Update product',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
    body: {
      content: {
        'application/json': {
          schema: productUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: productSchema,
        },
      },
      description: 'Product updated successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Product not found',
    },
    422: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Validation error',
    },
  },
})

const deleteProductRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Products'],
  summary: 'Delete product',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    204: {
      description: 'Product deleted successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Product not found',
    },
  },
})

export {
  createProductRoute,
  deleteProductRoute,
  getAllProductsRoute,
  getProductByIdRoute,
  updateProductRoute,
}
