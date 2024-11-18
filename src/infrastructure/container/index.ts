import {
  CreateOrderUseCase,
  DeleteOrderUseCase,
  FindAllOrdersUseCase,
  FindOrderByIdUseCase,
  FindOrdersByUserIdUseCase,
} from '@app/use-cases/orders'

import {
  CreateProductUseCase,
  DeleteProductUseCase,
  FindAllProductsUseCase,
  FindProductByIdUseCase,
  UpdateProductUseCase,
} from '@app/use-cases/products'

import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase,
  FindUserByIdUseCase,
  UpdateUserUseCase,
} from '@app/use-cases/users'

import Neon from '@infra/database/neon'

import Redis from '@infra/database/redis'
import { container } from 'tsyringe'
import OrderRepository from '../repositories/order.repository'
import ProductRepository from '../repositories/product.repository'
import UserRepository from '../repositories/user.repository'


// Database
container.registerSingleton(Neon.name, Neon)
container.registerSingleton(Redis.name, Redis)

// Repositories
container.registerSingleton(UserRepository.name, UserRepository)
container.registerSingleton(ProductRepository.name, ProductRepository)
container.registerSingleton(OrderRepository.name, OrderRepository)

// User Use Cases
container.registerSingleton(CreateUserUseCase.name, CreateUserUseCase)
container.registerSingleton(FindUserByIdUseCase.name, FindUserByIdUseCase)
container.registerSingleton(FindAllUsersUseCase.name, FindAllUsersUseCase)
container.registerSingleton(UpdateUserUseCase.name, UpdateUserUseCase)
container.registerSingleton(DeleteUserUseCase.name, DeleteUserUseCase)

// Product Use Cases
container.registerSingleton(CreateProductUseCase.name, CreateProductUseCase)
container.registerSingleton(
  FindProductByIdUseCase.name,
  FindProductByIdUseCase,
)
container.registerSingleton(
  FindAllProductsUseCase.name,
  FindAllProductsUseCase,
)
container.registerSingleton(UpdateProductUseCase.name, UpdateProductUseCase)
container.registerSingleton(DeleteProductUseCase.name, DeleteProductUseCase)

// Order Use Cases
container.registerSingleton(CreateOrderUseCase.name, CreateOrderUseCase)
container.registerSingleton(FindOrderByIdUseCase.name, FindOrderByIdUseCase)
container.registerSingleton(FindAllOrdersUseCase.name, FindAllOrdersUseCase)
container.registerSingleton(
  FindOrdersByUserIdUseCase.name,
  FindOrdersByUserIdUseCase,
)
container.registerSingleton(DeleteOrderUseCase.name, DeleteOrderUseCase)

export { container }
