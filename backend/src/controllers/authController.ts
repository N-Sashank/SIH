import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return sendError(res, 409, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(res, 'User registered successfully', {
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return sendError(res, 500, 'Internal server error during registration');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return sendError(res, 401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return sendSuccess(res, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, 'Internal server error during login');
  }
};