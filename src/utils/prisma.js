import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { id } from 'zod/locales';

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: true }   // Producción: verificar
    : false,                           // Desarrollo: sin SSL
max: 5, // Límite de conexiones en el pool
idleTimeoutMillis: 10000, // 30 segundos
}
);
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });