import { z } from 'zod';
import { ValidationError } from '../utils/error.js';

export const RegisterSchema = z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email'),
    password: z.string({ error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password cannot be more than 128 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    name: z.string({ error: 'Name is required' })
        .min(3, 'Name must be at least 3 characters')
        .max(8, 'Name cannot be more than 8 characters')
});


export const LoginSchema = z.object({
    email: z.string({ error: 'Email is required' }).email('Invalid email'),
    password: z.string({ error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password cannot be more than 128 characters')
});

export default { RegisterSchema, LoginSchema };