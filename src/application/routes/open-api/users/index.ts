import {
  userCreateSchema,
  userSchema,
  userUpdateSchema,
} from '@/domain/validations'

import { applicationErrorSchema } from '@/domain/validations/applicationError.schema'
import { createRoute, z } from '@hono/zod-openapi'

const createUserRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Users'],
  summary: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userCreateSchema,
        },
      },
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
          schema: applicationErrorSchema,
        },
      },
      description: 'Validation error',
    },
  },
})

const getUserByIdRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
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
          schema: applicationErrorSchema,
        },
      },
      description: 'User not found',
    },
  },
})

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
          schema: applicationErrorSchema,
        },
      },
      description: 'Server error',
    },
  },
})

const updateUserRoute = createRoute({
  method: 'patch',
  path: '/{id}',
  tags: ['Users'],
  summary: 'Update user',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
    body: {
      content: {
        'application/json': {
          schema: userUpdateSchema,
        },
      },
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
          schema: applicationErrorSchema,
        },
      },
      description: 'User not found',
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

const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: ['Users'],
  summary: 'Delete user',
  request: {
    params: z.object({
      id: z.string().regex(/^\d+$/).transform(Number),
    }),
  },
  responses: {
    204: {
      description: 'User deleted successfully',
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

export {
  createUserRoute,
  deleteUserRoute,
  getAllUsersRoute,
  getUserByIdRoute,
  updateUserRoute,
}
