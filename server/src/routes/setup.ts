import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate';
import * as setupController from '../controllers/setupController';

const router = Router();

// POST /api/setup/generate-token - ایجاد توکن فعال‌سازی
router.post(
  '/generate-token',
  setupController.generateSetupToken
);

// POST /api/setup/activate - فعال‌سازی Admin
router.post(
  '/activate',
  validate([
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ]),
  setupController.activateAdmin
);

// GET /api/setup/status - بررسی وضعیت Setup
router.get(
  '/status',
  setupController.checkSetupStatus
);

export default router;
