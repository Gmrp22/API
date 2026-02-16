import { Router } from 'express';
import { register, login } from '../controllers/auth.js';
import validate from '../middlewares/zodValidator.js';
import { RegisterSchema, LoginSchema } from '../schema/zodValidator.js';
const router = Router();

router.post('/register', validate(RegisterSchema), register);
router.post('/login', validate(LoginSchema), login);

export default router;