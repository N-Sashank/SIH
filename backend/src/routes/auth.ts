import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { validate } from '../middleware/validation';
import { authSchema } from '../schemas';

const router = Router();

router.post('/register', validate(authSchema.extend({ name: authSchema.shape.name, role: authSchema.shape.role })), register); // .required()
router.post('/login', validate(authSchema.omit({ name: true, role: true })), login);

export default router;