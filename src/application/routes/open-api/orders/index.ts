import { applicationErrorSchema } from '@/domain/validations/applicationError.schema'
import {
  orderCreateSchema,
  orderSchema,
} from '@/domain/validations/order.schema'
import { createRoute, z } from '@hono/zod-openapi'

const createOrderRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Orders'],
  summary: 'Create a new order',
  request: {
    body: {
      content: {
        'application/json': {
          schema: orderCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: orderSchema,
        },
      },
      description: 'Order created successfully',
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

const getOrderByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Orders'],
  summary: 'Get order by ID',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: orderSchema,
        },
      },
      description: 'Order found',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Order not found',
    },
  },
})

const getAllOrdersRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Orders'],
  summary: 'Get all orders',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(orderSchema),
        },
      },
      description: 'List of orders',
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

const getOrdersByUserIdRoute = createRoute({
  method: 'get',
  path: '/user/{userId}',
  tags: ['Orders'],
  summary: 'Get orders by user ID',
  request: {
    params: z.object({
      userId: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(orderSchema),
        },
      },
      description: 'List of user orders',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'User not found',
    },
  },
})

const deleteOrderRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Orders'],
  summary: 'Delete order',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    204: {
      description: 'Order deleted successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Order not found',
    },
  },
})

const createOrderFromCartRoute = createRoute({
  method: 'post',
  path: '/cart/{cartId}',
  tags: ['Orders'],
  summary: 'Create order from cart',
  request: {
    params: z.object({
      cartId: z.string(),
    }),
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: orderSchema,
        },
      },
      description: 'Order created successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: applicationErrorSchema,
        },
      },
      description: 'Cart not found',
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

export {
  createOrderFromCartRoute,
  createOrderRoute,
  deleteOrderRoute,
  getAllOrdersRoute,
  getOrderByIdRoute,
  getOrdersByUserIdRoute,
}
