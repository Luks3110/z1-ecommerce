import Database from '@/infrastructure/database/db'

import {
  AddCartItemUseCase,
  ClearCartUseCase,
  CreateCartUseCase,
  DeleteCartUseCase,
  FindCartByIdUseCase,
  FindCartByUserIdUseCase,
  RemoveCartItemUseCase,
  UpdateCartItemQuantityUseCase,
} from '@app/use-cases/carts'

import {
  CreateOrderUseCase,
  DeleteOrderUseCase,
  FindAllOrdersUseCase,
  FindOrderByIdUseCase,
  FindOrdersByUserIdUseCase,
} from '@app/use-cases/orders'

import { CreateOrderFromCartUseCase } from '@app/use-cases/orders/create-order-from-cart.use-case'

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
import Redis from '@infra/database/redis'
import { container } from 'tsyringe'
import {
  CartRepository,
  OrderRepository,
  ProductRepository,
  UserRepository,
} from '../repositories'

// Database
container.registerSingleton(Database.name, Database)
container.registerSingleton(Redis.name, Redis)

// Repositories
container.registerSingleton(UserRepository.name, UserRepository)
container.registerSingleton(ProductRepository.name, ProductRepository)
container.registerSingleton(OrderRepository.name, OrderRepository)
container.registerSingleton(CartRepository.name, CartRepository)

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
container.registerSingleton(CreateOrderFromCartUseCase.name, CreateOrderFromCartUseCase)

// Cart Use Cases
container.registerSingleton(CreateCartUseCase.name, CreateCartUseCase)
container.registerSingleton(FindCartByIdUseCase.name, FindCartByIdUseCase)
container.registerSingleton(FindCartByUserIdUseCase.name, FindCartByUserIdUseCase)
container.registerSingleton(AddCartItemUseCase.name, AddCartItemUseCase)
container.registerSingleton(RemoveCartItemUseCase.name, RemoveCartItemUseCase)
container.registerSingleton(UpdateCartItemQuantityUseCase.name, UpdateCartItemQuantityUseCase)
container.registerSingleton(ClearCartUseCase.name, ClearCartUseCase)
container.registerSingleton(DeleteCartUseCase.name, DeleteCartUseCase)

export { container }
