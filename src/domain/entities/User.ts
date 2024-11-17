export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>; 
