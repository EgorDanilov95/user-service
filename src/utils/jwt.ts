// @ts-nocheck

import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: number;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};