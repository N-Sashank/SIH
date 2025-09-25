import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';

const router = Router();
const prisma = new PrismaClient();

router.get('/internships', authMiddleware, roleMiddleware('FACULTY'), async (req: Request, res: Response) => {
  try {
    const internships = await prisma.internship.findMany({
      include: {
        industry: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
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


router.get('/applications/:internshipId', authMiddleware, roleMiddleware('FACULTY'), async (req: Request, res: Response) => {
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
            studentProfile: true
          }
        },
        internship: {
          select: {
            id: true,
            roleName: true,
            industry: {
              select: {
                name: true
              }
            }
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

router.get('/students/:id/feedback', authMiddleware, roleMiddleware('FACULTY'), async (req: Request, res: Response) => {
  try {
    const { id: studentId } = req.params;

    const feedbacks = await prisma.feedback.findMany({
      where: { studentId },
      include: {
        industry: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        internship: {
          select: {
            id: true,
            roleName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      message: 'Student feedback retrieved successfully',
      data: { feedbacks }
    });
  } catch (error) {
    console.error('Feedback retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});

export default router;