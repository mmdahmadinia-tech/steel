import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as usersController from '../controllers/usersController';

const router = Router();

// GET /api/users - دریافت همه کاربران
router.get(
  '/',
  authenticateToken,
  requireRole('admin'),
  usersController.getUsers
);

// POST /api/users - ایجاد کاربر جدید
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  validate([
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('role').isIn(['admin', 'eaf_user', 'lf_user', 'ccm_user', 'analyst']).withMessage('Invalid role'),
    body('unitAccess').isArray().withMessage('Unit access must be an array'),
  ]),
  usersController.createUser
);

// PUT /api/users/:id - به‌روزرسانی کاربر
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  usersController.updateUser
);

// DELETE /api/users/:id - حذف کاربر
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  usersController.deleteUser
);

export default router;
