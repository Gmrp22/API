import { z } from 'zod';
import { ValidationError } from '../utils/error.js';
export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
});

export function validateRegister(schema) {
    return (req, res, next) => {
        try {
            req.validatedData = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return next(new ValidationError(error.errors));
            }
            return next(error);
        }
    };
}

export default validateRegister(RegisterSchema);