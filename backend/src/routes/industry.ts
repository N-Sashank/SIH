import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { validate, internshipSchema, feedbackSchema } from '../middleware/validation';

const router = Router();
const prisma = new PrismaClient();

router.post('/internships', 
  authMiddleware, 
  roleMiddleware('INDUSTRY'), 
  validate(internshipSchema), 
  async (req: Request, res: Response) => {
    try {
      const { roleName, duration, stipend, description, location } = req.body;
      const industryId = req.user!.userId;

      const internship = await prisma.internship.create({
        data: {
          industryId,
          roleName,
          duration,
          stipend,
          description,
          location
        }
      });

      res.status(201).json({
        success: true,
        message: 'Internship posted successfully',
        data: { internship }
      });
    } catch (error) {
      console.error('Internship creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  }
);

router.get('/internships', authMiddleware, roleMiddleware('INDUSTRY'), async (req: Request, res: Response) => {
  try {
    const industryId = req.user!.userId;

    const internships = await prisma.internship.findMany({
      where: { industryId },
      include: {
        applications: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Internships retrieved successfully',
      data: { internships }
    });
  } catch (error) {
    console.error('Internships retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});

router.get('/applications/:internshipId', authMiddleware, roleMiddleware('INDUSTRY'), async (req: Request, res: Response) => {
  try {
    const { internshipId } = req.params;
    const industryId = req.user!.userId;

    // Verify internship belongs to this industry
    const internship = await prisma.internship.findFirst({
      where: {
        id: internshipId,
        industryId
      }
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
        data: null
      });
    }

    const applications = await prisma.application.findMany({
      where: { internshipId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            studentProfile: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Applications retrieved successfully',
      data: { applications }
    });
  } catch (error) {
    console.error('Applications retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});

router.post('/applications/:applicationId/approve', authMiddleware, roleMiddleware('INDUSTRY'), async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const industryId = req.user!.userId;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        internship: {
          industryId
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
        data: null
      });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'APPROVED' }
    });

    res.json({
      success: true,
      message: 'Application approved successfully',
      data: { application: updatedApplication }
    });
  } catch (error) {
    console.error('Application approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});

router.post('/applications/:applicationId/reject', authMiddleware, roleMiddleware('INDUSTRY'), async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const industryId = req.user!.userId;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        internship: {
          industryId
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
        data: null
      });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'REJECTED' }
    });

    res.json({
      success: true,
      message: 'Application rejected successfully',
      data: { application: updatedApplication }
    });
  } catch (error) {
    console.error('Application rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});


router.post('/feedback', 
  authMiddleware, 
  roleMiddleware('INDUSTRY'), 
  validate(feedbackSchema), 
  async (req: Request, res: Response) => {
    try {
      const { studentId, internshipId, feedbackText } = req.body;
      const industryId = req.user!.userId;

      
      const internship = await prisma.internship.findFirst({
        where: {
          id: internshipId,
          industryId
        }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          message: 'Internship not found',
          data: null
        });
      }

      
      const application = await prisma.application.findFirst({
        where: {
          studentId,
          internshipId,
          status: 'APPROVED'
        }
      });

      if (!application) {
        return res.status(400).json({
          success: false,
          message: 'No approved application found for this student and internship',
          data: null
        });
      }

      const feedback = await prisma.feedback.create({
        data: {
          industryId,
          studentId,
          internshipId,
          feedbackText
        }
      });

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: { feedback }
      });
    } catch (error) {
      console.error('Feedback creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      });
    }
  }
);

export default router;