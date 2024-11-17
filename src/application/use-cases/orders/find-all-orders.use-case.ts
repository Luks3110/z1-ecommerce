import 'reflect-metadata';

import type { Order, OrderItem } from "@/domain/entities/Order";
import type { IOrderRepository } from "@/domain/repositories/IOrderRepository";
import type { ResultTuple } from "@/domain/utils/result";
import OrderRepository from "@infra/repositories/order.repository";
import { inject, injectable } from "tsyringe";

@injectable()
class FindAllOrdersUseCase {
    constructor(
        @inject(OrderRepository.name)
        private orderRepository: IOrderRepository
    ) {}

    async execute(): Promise<ResultTuple<Array<Order & { items: OrderItem[] }>>> {
        return await this.orderRepository.findAll();
    }
}

export default FindAllOrdersUseCase; 
