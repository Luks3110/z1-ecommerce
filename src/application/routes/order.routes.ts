import 'reflect-metadata';

import type { CreateOrderData } from '@/domain/entities/Order';
import { applicationErrorSchema } from '@/domain/validations/applicationError.schema';
import { orderCreateSchema, orderSchema } from "@domain/validations/order.schema";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from '@infrastructure/container';
import CreateOrderUseCase from '../use-cases/orders/create-order.use-case';
import DeleteOrderUseCase from '../use-cases/orders/delete-order.use-case';
import FindAllOrdersUseCase from '../use-cases/orders/find-all-orders.use-case';
import FindOrderByIdUseCase from '../use-cases/orders/find-order-by-id.use-case';
import FindOrdersByUserIdUseCase from '../use-cases/orders/find-orders-by-user-id.use-case';

const orderRoutes = new OpenAPIHono();

const createOrderRoute = createRoute({
    method: 'post',
    path: '/',
    tags: ['Orders'],
    summary: 'Create a new order',
    request: {
        body: {
            content: {
                "application/json": {
                    schema: orderCreateSchema
                }
            }
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
                    schema: applicationErrorSchema
                }
            },
            description: 'Validation error',
        }
    },
});

const getOrderByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Orders'],
    summary: 'Get order by ID',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        })
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
                    schema: applicationErrorSchema
                }
            },
            description: 'Order not found',
        }
    },
});

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
                    schema: applicationErrorSchema
                }
            },
            description: 'Server error',
        }
    },
});

const getOrdersByUserIdRoute = createRoute({
    method: 'get',
    path: '/user/{userId}',
    tags: ['Orders'],
    summary: 'Get orders by user ID',
    request: {
        params: z.object({
            userId: z.string().regex(/^\d+$/).transform(Number)
        })
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
                    schema: applicationErrorSchema
                }
            },
            description: 'User not found',
        }
    },
});

const deleteOrderRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Orders'],
    summary: 'Delete order',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        })
    },
    responses: {
        204: {
            description: 'Order deleted successfully',
        },
        404: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'Order not found',
        }
    },
});

orderRoutes.openapi(createOrderRoute, async (c) => {
    const orderData = c.req.valid('json') as CreateOrderData;
    const createOrderUseCase = container.resolve(CreateOrderUseCase);
    const [order, error] = await createOrderUseCase.execute(orderData);

    if (error) {
        return c.json(error, 422);
    }

    return c.json(order, 201);
});

orderRoutes.openapi(getOrderByIdRoute, async (c) => {
    const { id } = c.req.valid('param');
    const findOrderByIdUseCase = container.resolve(FindOrderByIdUseCase);
    const [order, error] = await findOrderByIdUseCase.execute(id);

    if (error) {
        return c.json(error, 404);
    }

    return c.json(order, 200);
});

orderRoutes.openapi(getAllOrdersRoute, async (c) => {
    const findAllOrdersUseCase = container.resolve(FindAllOrdersUseCase);
    const [orders, error] = await findAllOrdersUseCase.execute();

    if (error) {
        return c.json(error, 500);
    }

    return c.json(orders, 200);
});

orderRoutes.openapi(getOrdersByUserIdRoute, async (c) => {
    const { userId } = c.req.valid('param');
    const findOrdersByUserIdUseCase = container.resolve(FindOrdersByUserIdUseCase);
    const [orders, error] = await findOrdersByUserIdUseCase.execute(userId);

    if (error) {
        return c.json(error, 404);
    }

    return c.json(orders, 200);
});

orderRoutes.openapi(deleteOrderRoute, async (c) => {
    const { id } = c.req.valid('param');
    const deleteOrderUseCase = container.resolve(DeleteOrderUseCase);
    const [, error] = await deleteOrderUseCase.execute(id);

    if (error) {
        return c.json(error, 404);
    }

    return c.body(null, 204);
});

export default orderRoutes; 
