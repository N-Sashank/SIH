import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const createInternship = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roleName, duration, stipend, description, location } = req.body;
    const industryId = req.user!.id;

    const internship = await prisma.internship.create({
      data: {
        industryId,
        roleName,
        duration,
        stipend,
        description,
        location,
      },
    });

    return sendSuccess(res, 'Internship created successfully', internship);
  } catch (error) {
    console.error('Create internship error:', error);
    return sendError(res, 500, 'Failed to create internship');
  }
};

export const getMyInternships = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const industryId = req.user!.id;

    const internships = await prisma.internship.findMany({
      where: { industryId },
      include: {
        applications: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
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
    console.error('Get my internships error:', error);
    return sendError(res, 500, 'Failed to retrieve internships');
  }
};

export const getApplicants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { internshipId } = req.params;
    const industryId = req.user!.id;

    // Verify internship belongs to this industry
    const internship = await prisma.internship.findFirst({
      where: {
        id: internshipId,
        industryId,
      }
    });

    if (!internship) {
      return sendError(res, 404, 'Internship not found');
    }

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
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return sendSuccess(res, 'Applicants retrieved successfully', applications);
  } catch (error) {
    console.error('Get applicants error:', error);
    return sendError(res, 500, 'Failed to retrieve applicants');
  }
};

export const approveApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const industryId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        internship: {
          industryId,
        }
      }
    });

    if (!application) {
      return sendError(res, 404, 'Application not found');
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'APPROVED' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return sendSuccess(res, 'Application approved successfully', updatedApplication);
  } catch (error) {
    console.error('Approve application error:', error);
    return sendError(res, 500, 'Failed to approve application');
  }
};

export const rejectApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { applicationId } = req.params;
    const industryId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        internship: {
          industryId,
        }
      }
    });

    if (!application) {
      return sendError(res, 404, 'Application not found');
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return sendSuccess(res, 'Application rejected successfully', updatedApplication);
  } catch (error) {
    console.error('Reject application error:', error);
    return sendError(res, 500, 'Failed to reject application');
  }
};

export const giveFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { studentId, internshipId, applicationId, feedbackText } = req.body;
    const industryId = req.user!.id;

    // Verify the industry owns this internship
    const internship = await prisma.internship.findFirst({
      where: {
        id: internshipId,
        industryId,
      }
    });

    if (!internship) {
      return sendError(res, 404, 'Internship not found');
    }

    const feedback = await prisma.feedback.create({
      data: {
        industryId,
        studentId,
        internshipId,
        applicationId,
        feedbackText,
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
          }
        }
      }
    });

    return sendSuccess(res, 'Feedback submitted successfully', feedback);
  } catch (error) {
    console.error('Give feedback error:', error);
    return sendError(res, 500, 'Failed to submit feedback');
  }
};