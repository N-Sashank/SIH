import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { validate, profileSchema } from '../middleware/validation';
import { upload } from '../middleware/upload';
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

router.get("/resume/:studentId?",authMiddleware, async (req, res: Response) => {
  try {
 const studentId = req.params.studentId || (req as any).user.userId;

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: studentId },
    });

    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({
        profile:profile,
        success: false,
        message: "Resume not found",
      });
    }

    const filePath = path.join(process.cwd(), profile.resumeUrl); 

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        file:filePath,
        success: false,
        message: "File not found on server",
      });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({
          success: false,
          message: "Failed to send file",
        });
      }
    });
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({
      success: false,
      message: "file size too large ",
    });
  }
});





router.get('/profile/:studentId?', authMiddleware, async (req: Request, res: Response) => {
  try {
    const studentId = req.params.studentId || (req as any).user.userId;

    const profile = await prisma.studentProfile.findUnique({
  where: { userId: studentId },
  select: {
    userId:true,
    name: true,
    email: true,
    phone: true,
    class: true,
    major: true,
    year: true,
    gpa: true,
    skills: true,
    bio: true,
    resumeUrl: true,
  },
});


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {  profile }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});

router.post(
  "/profile",
  authMiddleware,
  roleMiddleware("STUDENT"),
  upload.single("resume"), // multer handles multipart/form-data
  validate(profileSchema.omit({ resumeUrl: true })), 
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        phone,
        class: studentClass,
        major,
        year,
        gpa,
        skills,
        bio,
      } = req.body;

      const userId = (req as any).user?.userId;
      const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;

      const profile = await prisma.studentProfile.upsert({
        where: { userId },
        update: { name, email, phone, class: studentClass, major, year, gpa, skills, bio, resumeUrl },
        create: { userId, name, email, phone, class: studentClass, major, year, gpa, skills, bio, resumeUrl },
        include: { user: { select: { name: true } } },
      });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: { profile, name: profile.user.name },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null,
      });
    }
  }
);






router.get('/applications', authMiddleware, async (req: Request, res: Response) => {
  try {
   const internships = await prisma.internship.findMany({
  where: {
    applications: {
      some: {
        studentId: req.user!.userId, 
      },
    },
  },
  include: {
    industry: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    applications: {
      where: {
        studentId: req.user!.userId,
      },
      select: {
        id: true,
        status: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
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

router.get('/internships', authMiddleware, async (req: Request, res: Response) => {
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
        
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({ success: true, data: { internships } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch internships' });
  }
});


router.post('/apply/:internshipId', authMiddleware, roleMiddleware('STUDENT'), async (req: Request, res: Response) => {
  try {
    const { internshipId } = req.params;
    const studentId = req.user!.userId;

    
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId }
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found',
        data: null
      });
    }

    
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_internshipId: {
          studentId,
          internshipId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Already applied to this internship',
        data: null
      });
    }

    
    const application = await prisma.application.create({
      data: {
        studentId,
        internshipId,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
});

export default router;