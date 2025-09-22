import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  });
};

export const sendSuccess = <T>(res: Response, message: string, data?: T): Response<ApiResponse<T>> => {
  return sendResponse(res, 200, true, message, data);
};

export const sendError = (res: Response, statusCode: number, message: string): Response<ApiResponse> => {
  return sendResponse(res, statusCode, false, message);
};