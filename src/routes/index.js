import { Router } from 'express';
import { register, login } from '../controllers/auth.js';
import validate from '../middlewares/zodValidator.js';
import { RegisterSchema, LoginSchema } from '../schema/zodValidator.js';
import jwtValidator from '../middlewares/jwtValidator.js';
import getUser from '../controllers/user.js';
const publicRouter = Router();
const privateRouter = Router();

publicRouter.post('/register', validate(RegisterSchema), register);
publicRouter.post('/login', validate(LoginSchema), login);


privateRouter.get('/user', jwtValidator, getUser);

export { publicRouter, privateRouter };