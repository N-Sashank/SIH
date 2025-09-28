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



router.get(
  "/applications",
  authMiddleware,
  roleMiddleware("FACULTY"),
  async (req: Request, res: Response) => {
    try {
      const applications = await prisma.application.findMany({
  select: {
    id: true,
    studentId: true, 
    status: true,
    createdAt: true,
    updatedAt: true,
    student: {
      select: {
        id: true,
        name: true,
        email: true,
        studentProfile: {
          select: {
            phone: true,
            class: true,
            major: true,
            year: true,
            gpa: true,
            skills: true,
            bio: true,
            resumeUrl: true,
          }
        }
      }
    },
    internship: {
      select: {
        id: true,
        roleName: true,
        duration: true,
        stipend: true,
        location: true,
        industry: {
          select: {
            name: true
          }
        }
      }
    }
  },
  orderBy: { createdAt: "desc" }
});


      const formatted = applications.map((app) => ({
        id: app.id,
        studentId: app.studentId,
        studentName: app.student.name,
        studentEmail: app.student.email,
        internshipTitle: app.internship.roleName,
        company: app.internship.industry.name,
        status: app.status.toLowerCase(), // "pending" | "approved" | "rejected"
        appliedDate: app.createdAt.toISOString().split("T")[0],
        resumeUrl: app.student.studentProfile?.resumeUrl || null
      }));

      res.json({
        success: true,
        message: "Applications retrieved successfully",
        data: formatted
      });
    } catch (error) {
      console.error("Applications retrieval error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null
      });
    }
  }
);




export default router;