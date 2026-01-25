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

function validateRegister(schema) {
    return (req, res, next) => {
        try {
            req.validatedData = schema.parse(req.body);
            next();
        } catch (error) { 
            if (error instanceof z.ZodError) {
                return next(new ValidationError(error.issues));
            }
            return next(error);
        }
    };
}

export default validateRegister(RegisterSchema);