import { z } from 'zod';
import { ValidationError } from '../utils/error.js';

export const RegisterSchema = z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email'),
    password: z.string({ error: 'Password is required' })
        .min(4, 'Password must be at least 4 characters')
        .max(10, 'Password cannot be more than 10 characters'),
    name: z.string({ error: 'Name is required' })
        .min(3, 'Name must be at least 3 characters')
        .max(8, 'Name cannot be more than 8 characters')
});


export const LoginSchema = z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email'),
    password: z.string({ error: 'Password is required' })
        .min(4, 'Password must be at least 4 characters')
        .max(10, 'Password cannot be more than 10 characters')
});

export default { RegisterSchema, LoginSchema };