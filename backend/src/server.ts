import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import industryRoutes from './routes/industry';
import facultyRoutes from './routes/faculty';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();


app.use(cors({
  origin:  'http://localhost:3001',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/id", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId; 

    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
      },
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/industry', industryRoutes);
app.use('/faculty', facultyRoutes);


app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: null
  });
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: null
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});