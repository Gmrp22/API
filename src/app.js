import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes/index.js';


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', router);


export default app;