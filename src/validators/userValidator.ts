import { z } from 'zod';


export const registerSchema = z.object({
  fullName: z.string().min(1, 'name is required'),
  birthDate: z.coerce.date(), 
  email: z.string().email('incorrect email format'),
  password: z.string().min(6, 'password has min 6 symbol'),
});

export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  email: z.string().email('incorrect email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export const userIdSchema = z.object({
  id: z.coerce.number().positive(),
});


export const blockUserSchema = userIdSchema;