import type { CreateOrderData, Order, OrderItem } from "../entities/Order";
import type { ResultTuple } from "../utils/result";

export interface IOrderRepository {
    create(orderData: CreateOrderData): Promise<ResultTuple<Order & { items: OrderItem[] }>>;
    findById(id: number): Promise<ResultTuple<Order & { items: OrderItem[] }>>;
    findAll(): Promise<ResultTuple<Array<Order & { items: OrderItem[] }>>>;
    findByUserId(userId: number): Promise<ResultTuple<Array<Order & { items: OrderItem[] }>>>;
    delete(id: number): Promise<ResultTuple<void>>;
} 
