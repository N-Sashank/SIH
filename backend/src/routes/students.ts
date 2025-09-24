import { Router } from 'express';
import { 
  createOrUpdateProfile, 
  getProfile, 
  getInternships, 
  applyToInternship, 
  submitReport 
} from '../controllers/studentController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { profileSchema, reportSchema } from '../schemas';

const router = Router();

// Apply authentication to all routes
router.use(authMiddleware);

router.post('/profile', roleMiddleware('STUDENT'), validate(profileSchema), createOrUpdateProfile);
router.get('/profile/:id', getProfile);
router.get('/internships', roleMiddleware('STUDENT'), getInternships);
router.post('/apply/:internshipId', roleMiddleware('STUDENT'), applyToInternship);
router.post('/report/:applicationId', roleMiddleware('STUDENT'), validate(reportSchema), submitReport);

export default router;