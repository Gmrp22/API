import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../config/env.js';

const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.nodeEnv === 'production'
    ? { rejectUnauthorized: true }
    : false,
  max: 5,
  idleTimeoutMillis: 10000
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });