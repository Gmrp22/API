import jwt from 'jsonwebtoken';
import { AuthenticationError } from './error.js';
import { config } from '../config/env.js';
export function generateToken(payload) {
  try {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: '15m',

    });
  } catch (error) {
    throw new Error('Token generation failed: ' + error.message);
  }
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Invalid token');
    }
    throw new Error('Token verification failed: ' + error.message);
  }
}
