import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController.js';
import { updateProfileValidator, changePasswordValidator } from '../validators/profileValidators.js';
import validate from '../middleware/validateMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfileValidator, validate, updateProfile);
router.put('/password', changePasswordValidator, validate, changePassword);

export default router;