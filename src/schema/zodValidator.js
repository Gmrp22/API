import { z } from 'zod';
import { ValidationError } from '../utils/error.js';

export const RegisterSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string()
        .min(4, 'Password must be at least 4 characters')
        .max(10, 'Password cannot be more than 10 characters'),
    name: z.string()
        .min(3, 'Name must be at least 3 characters')
        .max(8, 'Name cannot be more than 8 characters')
});


export const LoginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string()
        .min(4, 'Password must be at least 4 characters')
        .max(10, 'Password cannot be more than 10 characters')
});

export default { RegisterSchema, LoginSchema };