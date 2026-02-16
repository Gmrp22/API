import jwt from 'jsonwebtoken';

export  function generateToken(payload) {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: '1d' 
    });
  } catch (error) {
    throw new Error('Token generation failed: ' + error.message);
  }
}

export  function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid token');
    }
    throw new Error('Token verification failed: ' + error.message);
  }
}
