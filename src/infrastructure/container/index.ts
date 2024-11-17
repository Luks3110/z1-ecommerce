import 'reflect-metadata';

import CreateOrderUseCase from '@/application/use-cases/orders/create-order.use-case';
import DeleteOrderUseCase from '@/application/use-cases/orders/delete-order.use-case';
import FindAllOrdersUseCase from '@/application/use-cases/orders/find-all-orders.use-case';
import FindOrderByIdUseCase from '@/application/use-cases/orders/find-order-by-id.use-case';
import FindOrdersByUserIdUseCase from '@/application/use-cases/orders/find-orders-by-user-id.use-case';
import CreateProductUseCase from '@/application/use-cases/products/create-product.use-case';
import DeleteProductUseCase from '@/application/use-cases/products/delete-product.use-case';
import FindAllProductsUseCase from '@/application/use-cases/products/find-all-products.use-case';
import FindProductByIdUseCase from '@/application/use-cases/products/find-product-by-id.use-case';
import UpdateProductUseCase from '@/application/use-cases/products/update-product.use-case';
import CreateUserUseCase from '@/application/use-cases/users/create-user.use-case';
import DeleteUserUseCase from '@/application/use-cases/users/delete-user.use-case';
import FindAllUsersUseCase from '@/application/use-cases/users/find-all-users.use-case';
import FindUserByIdUseCase from '@/application/use-cases/users/find-user-by-id.use-case';
import UpdateUserUseCase from '@/application/use-cases/users/update-user.use-case';
import Neon from '@infrastructure/database/neon';
import Redis from '@infrastructure/database/redis';
import { container } from 'tsyringe';
import OrderRepository from '../repositories/order.repository';
import ProductRepository from '../repositories/product.repository';
import UserRepository from '../repositories/user.repository';

// Database
container.registerSingleton(Neon.name, Neon);
container.registerSingleton(Redis.name, Redis);

// Repositories
container.registerSingleton(UserRepository.name, UserRepository);
container.registerSingleton(ProductRepository.name, ProductRepository);
container.registerSingleton(OrderRepository.name, OrderRepository);

// User Use Cases
container.registerSingleton(CreateUserUseCase.name, CreateUserUseCase);
container.registerSingleton(FindUserByIdUseCase.name, FindUserByIdUseCase);
container.registerSingleton(FindAllUsersUseCase.name, FindAllUsersUseCase);
container.registerSingleton(UpdateUserUseCase.name, UpdateUserUseCase);
container.registerSingleton(DeleteUserUseCase.name, DeleteUserUseCase);

// Product Use Cases
container.registerSingleton(CreateProductUseCase.name, CreateProductUseCase);
container.registerSingleton(FindProductByIdUseCase.name, FindProductByIdUseCase);
container.registerSingleton(FindAllProductsUseCase.name, FindAllProductsUseCase);
container.registerSingleton(UpdateProductUseCase.name, UpdateProductUseCase);
container.registerSingleton(DeleteProductUseCase.name, DeleteProductUseCase);

// Order Use Cases
container.registerSingleton(CreateOrderUseCase.name, CreateOrderUseCase);
container.registerSingleton(FindOrderByIdUseCase.name, FindOrderByIdUseCase);
container.registerSingleton(FindAllOrdersUseCase.name, FindAllOrdersUseCase);
container.registerSingleton(FindOrdersByUserIdUseCase.name, FindOrdersByUserIdUseCase);
container.registerSingleton(DeleteOrderUseCase.name, DeleteOrderUseCase);

export { container };
