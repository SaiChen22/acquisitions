import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(3).max(255),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(5).max(128),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signinSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(5).max(128),
});
