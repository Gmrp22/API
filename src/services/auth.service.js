import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export async function registerUser(data) {
    const {email,password,name} = data
    const exists =  await prisma.user.findUnique({ where: { email } });
    if (exists) {
        const error = new Error('User already exists');
        error.statusCode = 409;
        throw error
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, name:name }
    });
    return { id: newUser.id, email: newUser.email };
}

