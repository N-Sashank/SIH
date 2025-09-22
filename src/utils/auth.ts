import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: { id: string; email: string; role: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { id: string; email: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
};