import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { publicRouter, privateRouter } from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 3, // limit each IP to 300 requests per windowMs
});
const app = express();
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', publicRouter);
app.use('/api', privateRouter);
app.use(errorHandler);


export default app;