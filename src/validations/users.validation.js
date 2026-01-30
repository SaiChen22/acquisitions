import {z} from 'zod';

export const userIdSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a numeric string').transform(Number),
});

export const updateUserSchema = z.object({
    name: z.string().trim().min(3).max(255).optional(),
    email: z.string().email().toLowerCase().trim().optional(),
    password: z.string().min(5).max(128).optional(),
    role: z.enum(['user', 'admin']).optional(),
}).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
});
