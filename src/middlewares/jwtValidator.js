import { AuthenticationError } from "../utils/error.js";
import { verifyToken } from "../utils/jwt.js";
export default function jwtValidator(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AuthenticationError('Missing token');
        }
        const token = authHeader.split(' ')[1];
        const verify = verifyToken(token);
        if (!verify) {
            throw new AuthenticationError('Invalid token');
        }
        req.user = verify;
        next();
    } catch (error) {
        if (error.isOperational) {
            return next(error);
        }
        next(new Error('Invalid token'));
    }
}