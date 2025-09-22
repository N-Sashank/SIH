import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['STUDENT', 'INDUSTRY', 'FACULTY']).optional(),
});

export const profileSchema = z.object({
  dob: z.string().optional(),
  age: z.number().min(16).max(100).optional(),
  collegeYear: z.string().optional(),
  hobbies: z.string().optional(),
  resumePath: z.string().optional(),
  cvPath: z.string().optional(),
});

export const internshipSchema = z.object({
  roleName: z.string().min(2, 'Role name must be at least 2 characters'),
  duration: z.string().min(1, 'Duration is required'),
  stipend: z.number().min(0, 'Stipend must be non-negative'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.enum(['ONLINE', 'OFFLINE']),
});

export const applicationSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

export const feedbackSchema = z.object({
  studentId: z.string().uuid(),
  internshipId: z.string().uuid(),
  applicationId: z.string().uuid().optional(),
  feedbackText: z.string().min(10, 'Feedback must be at least 10 characters'),
});

export const reportSchema = z.object({
  reportPath: z.string().min(1, 'Report path is required'),
});