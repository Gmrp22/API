import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/error.js';
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export async function registerUser(data) {
    const { email, password, name } = data
    try {
        const exists = await prisma.user.findUnique({ where: { email } }); //race condition
        if (exists) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name: name }
        });
        return { id: newUser.id, email: newUser.email };
    } catch (error) {
        if (error.isOperational) {
            throw error;
        }
        throw new Error('Registration failed: ' + error.message);
    }
}

export async function loginUser(data) {
    const { email, password } = data
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }
        return { id: user.id, email: user.email };
    } catch (error) {
        if (error.isOperational) {
            throw error;
        }
        throw new Error('Login failed: ' + error.message);
    }
}
