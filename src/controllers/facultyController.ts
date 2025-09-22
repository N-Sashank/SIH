import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getAllInternships = async (req: AuthenticatedRequest, res: Response) => {
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
        _count: {
          select: {
            applications: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return sendSuccess(res, 'Internships retrieved successfully', internships);
  } catch (error) {
    console.error('Get all internships error:', error);
    return sendError(res, 500, 'Failed to retrieve internships');
  }
};

export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { internshipId } = req.params;

    const applications = await prisma.application.findMany({
      where: { internshipId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            studentProfile: true,
          }
        },
        internship: {
          select: {
            id: true,
            roleName: true,
            duration: true,
            stipend: true,
            industry: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return sendSuccess(res, 'Applications retrieved successfully', applications);
  } catch (error) {
    console.error('Get applications error:', error);
    return sendError(res, 500, 'Failed to retrieve applications');
  }
};

export const getStudentReports = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const applications = await prisma.application.findMany({
      where: {
        studentId: id,
        status: 'APPROVED',
        reportPath: { not: null },
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        internship: {
          select: {
            id: true,
            roleName: true,
            duration: true,
            industry: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });

    return sendSuccess(res, 'Student reports retrieved successfully', applications);
  } catch (error) {
    console.error('Get student reports error:', error);
    return sendError(res, 500, 'Failed to retrieve student reports');
  }
};

export const getStudentFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const feedback = await prisma.feedback.findMany({
      where: { studentId: id },
      include: {
        industry: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        internship: {
          select: {
            id: true,
            roleName: true,
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return sendSuccess(res, 'Student feedback retrieved successfully', feedback);
  } catch (error) {
    console.error('Get student feedback error:', error);
    return sendError(res, 500, 'Failed to retrieve student feedback');
  }
};