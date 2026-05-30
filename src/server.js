import http from 'http';
import { config } from './config/env.js';
import app from './app.js';
import { prisma } from './utils/prisma.js';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 3, // limit each IP to 300 requests per windowMs
});
const PORT = config.port;

const server = http.createServer(app);
app.use(limiter);


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
  });
});
process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
  });
});