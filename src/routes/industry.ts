import { Router } from 'express';
import { 
  createInternship, 
  getMyInternships, 
  getApplicants, 
  approveApplication, 
  rejectApplication, 
  giveFeedback 
} from '../controllers/industryController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { internshipSchema, feedbackSchema } from '../schemas';

const router = Router();

// Apply authentication and role check to all routes
router.use(authMiddleware, roleMiddleware('INDUSTRY'));

router.post('/internships', validate(internshipSchema), createInternship);
router.get('/internships', getMyInternships);
router.get('/applications/:internshipId', getApplicants);
router.post('/applications/:applicationId/approve', approveApplication);
router.post('/applications/:applicationId/reject', rejectApplication);
router.post('/feedback', validate(feedbackSchema), giveFeedback);

export default router;