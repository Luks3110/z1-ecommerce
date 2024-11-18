import 'reflect-metadata';

import type { Product } from '@/domain/entities/Product';
import { OpenAPIHono } from "@hono/zod-openapi";
import { container } from '@infra/container';
import { CreateProductUseCase, DeleteProductUseCase, FindAllProductsUseCase, FindProductByIdUseCase, UpdateProductUseCase } from '../use-cases/products';
import { createProductRoute, deleteProductRoute, getAllProductsRoute, getProductByIdRoute, updateProductRoute } from './open-api/products';

const productRoutes = new OpenAPIHono();

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
