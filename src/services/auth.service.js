import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.js';
import { UnauthorizedError, ConflictError } from '../utils/error.js';

const SALT_ROUNDS = 10;

export async function registerUser(data) {
    const { email, password, name } = data
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword, name: name }
        });
        return { user: { id: newUser.id, email: newUser.email }, role: newUser.role };
    } catch (error) {
        if (error.code === 'P2002') {
            throw new UnauthorizedError('Invalid credentials');
        }
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
        return { user: { id: user.id, email: user.email }, role: user.role };
    } catch (error) {
        if (error.isOperational) {
            throw error;
        }
        throw new Error('Login failed: ' + error.message);
    }
}
