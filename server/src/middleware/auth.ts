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
    mustChangePassword?: boolean;
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
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      fullName: decoded.fullName,
      mustChangePassword: decoded.mustChangePassword || false,
    };
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
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // مدیر به همه واحدها دسترسی دارد
    if (req.user.role === 'admin') {
      return next();
    }

    // بررسی دسترسی کاربر از دیتابیس
    try {
      const { query } = await import('../database/pool');
      const result = await query(
        'SELECT unit_access FROM users WHERE id = $1 AND is_active = TRUE',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'User not found or inactive' });
      }

      const unitAccess: string[] = result.rows[0].unit_access || [];
      
      if (!unitAccess.includes(unit)) {
        return res.status(403).json({ error: `Access denied to unit: ${unit}` });
      }

      next();
    } catch (error) {
      console.error('Unit access check error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Middleware بررسی نیاز به تغییر رمز عبور
export async function requirePasswordChanged(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // اگر کاربر نیاز به تغییر رمز دارد، دسترسی مسدود شود
  if (req.user.mustChangePassword) {
    return res.status(403).json({ 
      error: 'Password change required',
      mustChangePassword: true 
    });
  }

  next();
}
