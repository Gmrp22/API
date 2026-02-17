import { Router } from 'express';
import { register, login } from '../controllers/auth.js';
import validate from '../middlewares/zodValidator.js';
import { RegisterSchema, LoginSchema } from '../schema/zodValidator.js';
import jwtValidator from '../middlewares/jwtValidator.js';
import getUser from '../controllers/user.js';
const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);


router.get('/user', jwtValidator, getUser);

export default router;