import { prisma } from "../utils/prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/error.js";
export default async function getUser(req, res, next) {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            throw new NotFoundError('User not found');
        }
        if (req.user.role !== 'admin') {
            throw new ForbiddenError('Insufficient permissions');
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}