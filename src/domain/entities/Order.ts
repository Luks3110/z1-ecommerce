import type { User } from "./User";

export interface Order {
    id: number;
    userId: number | null;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
}

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    priceAtTime: number;
    createdAt: Date;
    updatedAt: Date;
}

export type NewOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type NewOrderItem = Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface CreateOrderData {
    userId: number;
    items: Array<{
        productId: number;
        quantity: number;
    }>;
} 
