import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          data: { errors }
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  };
};


export const authSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'INDUSTRY', 'FACULTY']).optional()
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  class: z.string().min(1, "Class is required"),
  major: z.string().min(1, "Major is required"),
  year: z.string().min(1, "Year is required"),
  gpa: z.string().min(1, "GPA is required"),
  skills: z.string().min(1, "Skills are required"),
  bio: z.string().min(1, "Bio is required"),
  resumeUrl: z.string().optional() 
});


export const internshipSchema = z.object({
  roleName: z.string().min(2, 'Role name must be at least 2 characters'),
  duration: z.string().min(1, 'Duration is required'),
  stipend: z.number().min(0, 'Stipend must be non-negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.enum(['ONLINE', 'OFFLINE'])
});

export const feedbackSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  internshipId: z.string().min(1, 'Internship ID is required'),
  feedbackText: z.string().min(10, 'Feedback must be at least 10 characters')
});