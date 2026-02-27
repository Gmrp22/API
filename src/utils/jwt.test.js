import { describe, it, expect, beforeAll } from 'vitest';
import { generateToken, verifyToken } from './jwt.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('jwt utils', () => {
  it('generates a valid token', async () => {
    const token = await generateToken({ userId: 1 });
    expect(typeof token).toBe('string');
  });

  it('verifies a valid token and returns the payload', async () => {
    const token = await generateToken({ userId: 42 });
    const payload = await verifyToken(token);
    expect(payload.userId).toBe(42);
  });

  it('throws on invalid token', async () => {
    await expect(verifyToken('invalid.token.here')).rejects.toThrow();
  });
});