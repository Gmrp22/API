import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export async function registerUser(email, password) {
    const exists =  await prisma.user.findUnique({ where: { email } });
    if (exists) {
        throw new PrismaUniqueConstraintError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword }
    });
    return { id: user.id, email: user.email };
}

