import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        return sendError(res, 400, `Validation error: ${errorMessage}`);
      }
      return sendError(res, 400, 'Invalid input data');
    }
  };
};