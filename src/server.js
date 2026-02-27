import http from 'http';
import { config } from './config/env.js';
import app from './app.js';
import { prisma } from './utils/prisma.js';

const PORT = config.port;

const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});


// Handle graceful shutdown
process.on('SIGTERM',  () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
  });
});
process.on('SIGINT',  () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await prisma.$disconnect();
  });
});