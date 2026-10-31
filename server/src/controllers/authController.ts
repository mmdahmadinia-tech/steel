import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database/pool';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';

// ورود کاربر
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    // بررسی وضعیت Setup
    const setupCheck = await query(
      'SELECT is_active FROM users WHERE username = $1',
      ['admin']
    );

    // اگر Admin وجود دارد ولی فعال نیست، سیستم نیاز به Setup دارد
    if (setupCheck.rows.length > 0 && !setupCheck.rows[0].is_active) {
      return res.status(403).json({ 
        error: 'System requires initial setup. Please contact administrator.' 
      });
    }

    // پیدا کردن کاربر
    const result = await query(
      'SELECT * FROM users WHERE username = $1 AND is_active = TRUE',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // بررسی رمز عبور
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ایجاد JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // ثبت در audit log (بدون رمز عبور)
    await query(
      `INSERT INTO audit_logs (user_id, user_name, action, record_type, details)
       VALUES ($1, $2, 'login', 'User', 'User logged in')`,
      [user.id, user.full_name]
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
        unitAccess: user.unit_access,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// تغییر رمز عبور
export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    // اعتبارسنجی رمز جدید
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // دریافت کاربر
    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    // بررسی رمز فعلی
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // رمزگذاری رمز جدید با bcrypt
    const salt = await bcrypt.genSalt(12);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // به‌روزرسانی رمز
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userId]
    );

    // ثبت در audit log (بدون رمز عبور)
    await query(
      `INSERT INTO audit_logs (user_id, user_name, action, record_type, details)
       VALUES ($1, $2, 'edit', 'User', 'Password changed')`,
      [userId, req.user!.fullName]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// دریافت اطلاعات کاربر فعلی
export async function getCurrentUser(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.id;

    const result = await query(
      'SELECT id, username, full_name, role, unit_access, is_active FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      unitAccess: user.unit_access,
      isActive: user.is_active,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
