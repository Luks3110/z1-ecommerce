import 'reflect-metadata';

import type { Product } from '@/domain/entities/Product';
import { applicationErrorSchema } from '@/domain/validations/applicationError.schema';
import { productCreateSchema, productSchema, productUpdateSchema } from "@/domain/validations/product.schema";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { container } from '@infra/container';
import CreateProductUseCase from '../use-cases/products/create-product.use-case';
import DeleteProductUseCase from '../use-cases/products/delete-product.use-case';
import FindAllProductsUseCase from '../use-cases/products/find-all-products.use-case';
import FindProductByIdUseCase from '../use-cases/products/find-product-by-id.use-case';
import UpdateProductUseCase from '../use-cases/products/update-product.use-case';

const productRoutes = new OpenAPIHono();

const createProductRoute = createRoute({
    method: 'post',
    path: '/',
    tags: ['Products'],
    summary: 'Create a new product',
    request: {
        body: {
            content: {
                "application/json": {
                    schema: productCreateSchema
                }
            }
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
                    schema: applicationErrorSchema
                }
            },
            description: 'Validation error',
        }
    },
});

const getProductByIdRoute = createRoute({
    method: 'get',
    path: '/{id}',
    tags: ['Products'],
    summary: 'Get product by ID',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        })
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
                    schema: applicationErrorSchema
                }
            },
            description: 'Product not found',
        }
    },
});

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
                    schema: applicationErrorSchema
                }
            },
            description: 'Server error',
        }
    },
});

const updateProductRoute = createRoute({
    method: 'patch',
    path: '/{id}',
    tags: ['Products'],
    summary: 'Update product',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        }),
        body: {
            content: {
                "application/json": {
                    schema: productUpdateSchema
                }
            }
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
                    schema: applicationErrorSchema
                }
            },
            description: 'Product not found',
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

const deleteProductRoute = createRoute({
    method: 'delete',
    path: '/{id}',
    tags: ['Products'],
    summary: 'Delete product',
    request: {
        params: z.object({
            id: z.string().regex(/^\d+$/).transform(Number)
        })
    },
    responses: {
        204: {
            description: 'Product deleted successfully',
        },
        404: {
            content: {
                'application/json': {
                    schema: applicationErrorSchema
                }
            },
            description: 'Product not found',
        }
    },
});

productRoutes.openapi(createProductRoute, async (c) => {
    const productEntity = c.req.valid('json');
    const createProductUseCase = container.resolve(CreateProductUseCase);
    const [product, error] = await createProductUseCase.execute(productEntity);

    if (error) {
        return c.json(error, 422);
    }

    return c.json(product, 201);
});

productRoutes.openapi(getProductByIdRoute, async (c) => {
    const { id } = c.req.valid('param');
    const findProductByIdUseCase = container.resolve(FindProductByIdUseCase);
    const [product, error] = await findProductByIdUseCase.execute(id);

    if (error) {
        return c.json(error, 404);
    }

    return c.json(product, 200);
});

productRoutes.openapi(getAllProductsRoute, async (c) => {
    const findAllProductsUseCase = container.resolve(FindAllProductsUseCase);
    const [products, error] = await findAllProductsUseCase.execute();

    if (error) {
        return c.json(error, 500);
    }

    return c.json(products, 200);
});

productRoutes.openapi(updateProductRoute, async (c) => {
    const { id } = c.req.valid('param');
    const productData = c.req.valid('json') as Partial<Product>;
    const updateProductUseCase = container.resolve(UpdateProductUseCase);
    const [product, error] = await updateProductUseCase.execute(id, productData);

    if (error) {
        if (error.name === 'NotFoundError') {
            return c.json(error, 404);
        }
        return c.json(error, 422);
    }

    return c.json(product, 200);
});

productRoutes.openapi(deleteProductRoute, async (c) => {
    const { id } = c.req.valid('param');
    const deleteProductUseCase = container.resolve(DeleteProductUseCase);
    const [, error] = await deleteProductUseCase.execute(id);

    if (error) {
        return c.json(error, 404);
    }

    return c.body(null, 204);
});

export default productRoutes; 
