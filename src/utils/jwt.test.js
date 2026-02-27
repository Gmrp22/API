import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.mock('../config/env.js', () => ({
  config: { jwtSecret: 'test-secret' },
}));

import { generateToken, verifyToken } from './jwt.js';

describe('jwt utils', () => {
  it('generates a valid token', () => {
    const token = generateToken({ userId: 1 });
    expect(typeof token).toBe('string');
  });

  it('verifies a valid token and returns the payload', () => {
    const token = generateToken({ userId: 42 });
    const payload = verifyToken(token);
    expect(payload.userId).toBe(42);
  });

  it('throws on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow();
  });
});
