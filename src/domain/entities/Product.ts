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

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>; 
