import { products } from "@infra/database/schema/products";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type NewProduct = typeof products.$inferInsert;
