import { registerUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import logger from "../utils/pino.js";


export async function register(req, res, next) {
  try {
    const data = req.validatedData;
    const user = await registerUser(data);
    const token = generateToken({ id: user.id, email: user.email });
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    next(error);
  }
}

export function login(req, res) {
  res.json({ message: 'User logged in successfully' });
}