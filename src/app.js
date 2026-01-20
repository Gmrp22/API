import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import validator from './middlewares/zodValidator.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(validator);
app.use('/api', router);
app.use(errorHandler);


export default app;