import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return sendError(res, 401, 'Access token is required');
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};

export const roleMiddleware = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, 'Insufficient permissions');
    }

    next();
  };
};