import http from 'http';
import 'dotenv/config';
import app from './app.js';
import { prisma } from './utils/prisma.js';

const PORT = process.env.PORT || 3000;

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