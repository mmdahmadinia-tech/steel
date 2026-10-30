import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validate';
import { authenticateToken, requireRole, requireUnitAccess } from '../middleware/auth';
import * as heatsController from '../controllers/heatsController';

const router = Router();

// GET /api/heats - دریافت همه ذوب‌ها
router.get(
  '/',
  authenticateToken,
  heatsController.getHeats
);

// GET /api/heats/next-id - دریافت Heat ID بعدی
router.get(
  '/next-id',
  authenticateToken,
  heatsController.getNextHeatId
);

// GET /api/heats/:id - دریافت یک ذوب
router.get(
  '/:id',
  authenticateToken,
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  heatsController.getHeat
);

// POST /api/heats - ایجاد ذوب جدید
router.post(
  '/',
  authenticateToken,
  requireRole('admin', 'eaf_user'),
  validate([
    body('heatId').notEmpty().withMessage('Heat ID is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('shift').notEmpty().withMessage('Shift is required'),
    body('steelGrade').notEmpty().withMessage('Steel grade is required'),
  ]),
  heatsController.createHeat
);

// PUT /api/heats/:id - به‌روزرسانی ذوب
router.put(
  '/:id',
  authenticateToken,
  requireRole('admin', 'eaf_user', 'lf_user', 'ccm_user'),
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  heatsController.updateHeat
);

// DELETE /api/heats/:id - حذف ذوب
router.delete(
  '/:id',
  authenticateToken,
  requireRole('admin'),
  validate([
    param('id').isNumeric().withMessage('ID must be a number'),
  ]),
  heatsController.deleteHeat
);

// DELETE /api/heats - حذف همه ذوب‌ها
router.delete(
  '/',
  authenticateToken,
  requireRole('admin'),
  heatsController.deleteAllHeats
);

// POST /api/heats/:heatId/eaf - ذخیره داده‌های EAF
router.post(
  '/:heatId/eaf',
  authenticateToken,
  requireRole('admin', 'eaf_user'),
  requireUnitAccess('EAF'),
  validate([
    param('heatId').notEmpty().withMessage('Heat ID is required'),
  ]),
  heatsController.saveEAFData
);

// POST /api/heats/:heatId/lf - ذخیره داده‌های LF
router.post(
  '/:heatId/lf',
  authenticateToken,
  requireRole('admin', 'lf_user'),
  requireUnitAccess('LF'),
  validate([
    param('heatId').notEmpty().withMessage('Heat ID is required'),
  ]),
  heatsController.saveLFData
);

// POST /api/heats/:heatId/ccm - ذخیره داده‌های CCM
router.post(
  '/:heatId/ccm',
  authenticateToken,
  requireRole('admin', 'ccm_user'),
  requireUnitAccess('CCM'),
  validate([
    param('heatId').notEmpty().withMessage('Heat ID is required'),
  ]),
  heatsController.saveCCMData
);

export default router;
