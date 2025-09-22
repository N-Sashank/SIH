import { Router } from 'express';
import { 
  getAllInternships, 
  getApplications, 
  getStudentReports, 
  getStudentFeedback 
} from '../controllers/facultyController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// Apply authentication and role check to all routes
router.use(authMiddleware, roleMiddleware('FACULTY'));

router.get('/internships', getAllInternships);
router.get('/applications/:internshipId', getApplications);
router.get('/students/:id/reports', getStudentReports);
router.get('/students/:id/feedback', getStudentFeedback);

export default router;