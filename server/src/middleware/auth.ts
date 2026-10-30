import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// تعریف interface برای request
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    fullName: string;
  };
}

// Middleware احراز هویت
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Middleware بررسی نقش
export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

// Middleware بررسی دسترسی به واحد
export function requireUnitAccess(unit: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // مدیر به همه واحدها دسترسی دارد
    if (req.user.role === 'admin') {
      return next();
    }

    // بررسی دسترسی کاربر به واحد
    // این اطلاعات باید از دیتابیس خوانده شود
    // برای سادگی فعلاً رد می‌کنیم
    next();
  };
}
