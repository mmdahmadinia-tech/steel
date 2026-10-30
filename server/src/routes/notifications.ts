import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticateToken, requireRole } from '../middleware/auth';
import * as notificationsController from '../controllers/notificationsController';

const router = Router();

// GET /api/notifications - دریافت همه اعلان‌ها
router.get(
  '/',
  authenticateToken,
  notificationsController.getNotifications
);

// POST /api/notifications - ایجاد اعلان جدید
router.post(
  '/',
  authenticateToken,
  requireRole('admin'),
  validate([
    body('message').notEmpty().withMessage('Message is required'),
  ]),
  notificationsController.createNotification
);

// PUT /api/notifications/:id/read - علامت‌گذاری به عنوان خوانده شده
router.put(
  '/:id/read',
  authenticateToken,
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  notificationsController.markAsRead
);

// PUT /api/notifications/read-all - علامت‌گذاری همه به عنوان خوانده شده
router.put(
  '/read-all',
  authenticateToken,
  notificationsController.markAllAsRead
);

// DELETE /api/notifications/:id - حذف اعلان
router.delete(
  '/:id',
  authenticateToken,
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  notificationsController.deleteNotification
);

export default router;
