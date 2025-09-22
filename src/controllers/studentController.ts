import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const createOrUpdateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { dob, age, collegeYear, hobbies, resumePath, cvPath } = req.body;
    const userId = req.user!.id;

    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        dob: dob ? new Date(dob) : undefined,
        age,
        collegeYear,
        hobbies,
        resumePath,
        cvPath,
      },
      create: {
        userId,
        dob: dob ? new Date(dob) : undefined,
        age,
        collegeYear,
        hobbies,
        resumePath,
        cvPath,
      },
    });

    return sendSuccess(res, 'Profile updated successfully', profile);
  } catch (error) {
    console.error('Profile update error:', error);
    return sendError(res, 500, 'Failed to update profile');
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requesterId = req.user!.id;

    // Students can only view their own profile, others can view any
    if (req.user!.role === 'STUDENT' && id !== requesterId) {
      return sendError(res, 403, 'Access denied');
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      }
    });

    if (!profile) {
      return sendError(res, 404, 'Profile not found');
    }

    return sendSuccess(res, 'Profile retrieved successfully', profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return sendError(res, 500, 'Failed to retrieve profile');
  }
};

export const getInternships = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const internships = await prisma.internship.findMany({
      include: {
        industry: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        applications: {
          where: {
            studentId: req.user!.id,
          },
          select: {
            id: true,
            status: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return sendSuccess(res, 'Internships retrieved successfully', internships);
  } catch (error) {
    console.error('Get internships error:', error);
    return sendError(res, 500, 'Failed to retrieve internships');
  }
};

export const applyToInternship = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { internshipId } = req.params;
    const studentId = req.user!.id;

    // Check if internship exists
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId }
    });

    if (!internship) {
      return sendError(res, 404, 'Internship not found');
    }

    // Check if already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_internshipId: {
          studentId,
          internshipId,
        }
      }
    });

    if (existingApplication) {
      return sendError(res, 409, 'Already applied to this internship');
    }

    const application = await prisma.application.create({
      data: {
        studentId,
        internshipId,
      },
      include: {
        internship: {
          select: {
            id: true,
            roleName: true,
            duration: true,
            stipend: true,
          }
        }
      }
    });

    return sendSuccess(res, 'Application submitted successfully', application);
  } catch (error) {
    console.error('Apply to internship error:', error);
    return sendError(res, 500, 'Failed to apply to internship');
  }
};

export const submitReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const { reportPath } = req.body;
    const studentId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        studentId,
        status: 'APPROVED',
      }
    });

    if (!application) {
      return sendError(res, 404, 'Approved application not found');
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { reportPath },
    });

    return sendSuccess(res, 'Report submitted successfully', updatedApplication);
  } catch (error) {
    console.error('Submit report error:', error);
    return sendError(res, 500, 'Failed to submit report');
  }
};