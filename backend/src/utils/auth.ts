import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserPayload } from '../types';
import { AUTH } from '../config/constants';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this';
const SALT_ROUNDS = AUTH.BCRYPT_ROUNDS;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: AUTH.TOKEN_EXPIRATION });
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_SECRET) as UserPayload;
};

