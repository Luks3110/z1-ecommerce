import { z } from '@hono/zod-openapi';

export const userSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2),
    email: z.string().email(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
}).openapi('User');

export const userCreateSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true }).openapi('UserCreate');

export const userUpdateSchema = userSchema.partial().omit({ id: true }).openapi('UserUpdate');

export type UserSchema = z.infer<typeof userSchema>;
