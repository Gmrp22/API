import 'dotenv/config';

const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];

function validateEnv() {
    const missing = requiredEnvVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (process.env.JWT_SECRET.length < 32) {
        throw new Error(
            'JWT_SECRET must be at least 32 characters. ' +
            'Generate one with: openssl rand -base64 32'
        );
    }
}

validateEnv();

export const config = {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
};