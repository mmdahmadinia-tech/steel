import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as authController from '../controllers/authController';

const router = Router();

// POST /api/auth/login - ورود کاربر
router.post(
  '/login',
  validate([
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  authController.login
);

// POST /api/auth/change-password - تغییر رمز عبور
router.post(
  '/change-password',
  authenticateToken,
  validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 4 }).withMessage('New password must be at least 4 characters'),
  ]),
  authController.changePassword
);

// GET /api/auth/me - دریافت اطلاعات کاربر فعلی
router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
