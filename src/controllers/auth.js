import { registerUser, loginUser } from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";


export async function register(req, res, next) {
  try {
    const data = req.validatedData;
    const user = await registerUser(data);
    const token = generateToken({ id: user.id });
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const data = req.validatedData;
    const user = await loginUser(data);
    const token = generateToken({ id: user.id });
    res.status(200).json({ message: 'User logged in successfully', user, token });
  } catch (error) {
    next(error);
  }
}