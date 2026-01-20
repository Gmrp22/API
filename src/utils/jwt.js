import jwt from 'jsonwebtoken';

export async function generateToken(payload) {
  return  await jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: '1d' 
  });

}

export async function verifyToken(token) {
  return await jwt.verify(token, process.env.JWT_SECRET);
}
