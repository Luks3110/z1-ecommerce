import { applicationErrorSchema } from '@/domain/validations/applicationError.schema'
import { addItemSchema, cartCreateSchema, cartResponseSchema, updateQuantitySchema } from '@/domain/validations/cart.schema'
import { createRoute, z } from '@hono/zod-openapi'

const createCartRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Carts'],
  summary: 'Create a new cart',
  request: {
    body: {
      content: {
        'application/json': {
          schema: cartCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: cartResponseSchema,
        },
      },
      description: 'Cart created successfully',
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

const getCartByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Carts'],
  summary: 'Get cart by ID',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: cartResponseSchema,
        },
      },
      description: 'Cart found',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart not found',
    },
  },
})

const getCartByUserIdRoute = createRoute({
  method: 'get',
  path: '/user/{userId}',
  tags: ['Carts'],
  summary: 'Get cart by user ID',
  request: {
    params: z.object({
      userId: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: cartResponseSchema,
        },
      },
      description: 'Cart found',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart not found',
    },
  },
})

const addItemRoute = createRoute({
  method: 'post',
  path: '/{id}/items',
  tags: ['Carts'],
  summary: 'Add item to cart',
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: addItemSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: cartResponseSchema,
        },
      },
      description: 'Item added to cart',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart not found',
    },
  },
})

const removeItemRoute = createRoute({
  method: 'delete',
  path: '/{id}/items/{productId}',
  tags: ['Carts'],
  summary: 'Remove item from cart',
  request: {
    params: z.object({
      id: z.string(),
      productId: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: cartResponseSchema,
        },
      },
      description: 'Item removed from cart',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart or item not found',
    },
  },
})

const updateQuantityRoute = createRoute({
  method: 'patch',
  path: '/{id}/items/{productId}',
  tags: ['Carts'],
  summary: 'Update item quantity',
  request: {
    params: z.object({
      id: z.string(),
      productId: z.string().regex(/^\d+$/).transform(Number),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateQuantitySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: cartResponseSchema,
        },
      },
      description: 'Item quantity updated',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart or item not found',
    },
  },
})

const clearCartRoute = createRoute({
  method: 'delete',
  path: '/{id}/items',
  tags: ['Carts'],
  summary: 'Clear cart',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'Cart cleared successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart not found',
    },
  },
})

const deleteCartRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Carts'],
  summary: 'Delete cart',
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    204: {
      description: 'Cart deleted successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart not found',
    },
  },
})

export {
  addItemRoute,
  clearCartRoute,
  createCartRoute,
  deleteCartRoute,
  getCartByIdRoute,
  getCartByUserIdRoute,
  removeItemRoute,
  updateQuantityRoute,
}
