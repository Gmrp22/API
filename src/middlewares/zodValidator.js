import { z } from 'zod';
import { ValidationError } from '../utils/error.js';


function validate(schema) {
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

export default validate;