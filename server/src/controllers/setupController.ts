import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../database/pool';

// ایجاد توکن فعال‌سازی اولیه
export async function generateSetupToken(req: Request, res: Response) {
  try {
    // بررسی اینکه آیا Admin قبلاً فعال شده است
    const adminCheck = await query(
      'SELECT id, is_active FROM users WHERE username = $1',
      ['admin']
    );

    if (adminCheck.rows.length > 0 && adminCheck.rows[0].is_active) {
      return res.status(400).json({ 
        error: 'Admin account already activated. Setup is complete.' 
      });
    }

    // ایجاد توکن یک‌بارمصرف
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 ساعت

    // ذخیره توکن در دیتابیس
    await query(
      `INSERT INTO setup_tokens (token, expires_at, used)
       VALUES ($1, $2, false)
       ON CONFLICT (token) DO UPDATE SET expires_at = $2, used = false`,
      [token, expiresAt]
    );

    // ثبت در audit log
    await query(
      `INSERT INTO audit_logs (user_name, action, record_type, details)
       VALUES ('system', 'create', 'SetupToken', 'Setup token generated')`
    );

    res.json({
      message: 'Setup token generated successfully',
      token: token,
      expiresAt: expiresAt.toISOString(),
      instructions: 'Use this token to activate the admin account. Token expires in 24 hours.'
    });
  } catch (error) {
    console.error('Generate setup token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// فعال‌سازی Admin با توکن
export async function activateAdmin(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    // اعتبارسنجی ورودی
    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // بررسی توکن
    const tokenResult = await query(
      'SELECT * FROM setup_tokens WHERE token = $1 AND used = false AND expires_at > NOW()',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // بررسی اینکه Admin قبلاً فعال نشده باشد
    const adminCheck = await query(
      'SELECT id, is_active FROM users WHERE username = $1',
      ['admin']
    );

    if (adminCheck.rows.length > 0 && adminCheck.rows[0].is_active) {
      return res.status(400).json({ error: 'Admin account already activated' });
    }

    // رمزگذاری رمز عبور با bcrypt
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // ایجاد یا به‌روزرسانی Admin
    if (adminCheck.rows.length === 0) {
      await query(
        `INSERT INTO users (username, password_hash, full_name, role, is_active, unit_access)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['admin', passwordHash, 'Super Admin', 'admin', true, ['EAF', 'LF', 'CCM']]
      );
    } else {
      await query(
        `UPDATE users 
         SET password_hash = $1, is_active = true, updated_at = CURRENT_TIMESTAMP
         WHERE username = $2`,
        [passwordHash, 'admin']
      );
    }

    // علامت‌گذاری توکن به عنوان استفاده شده
    await query(
      'UPDATE setup_tokens SET used = true WHERE token = $1',
      [token]
    );

    // ثبت در audit log
    await query(
      `INSERT INTO audit_logs (user_name, action, record_type, details)
       VALUES ('system', 'activate', 'Admin', 'Admin account activated')`
    );

    res.json({
      message: 'Admin account activated successfully',
      instructions: 'You can now login with username: admin'
    });
  } catch (error) {
    console.error('Activate admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// بررسی وضعیت Setup
export async function checkSetupStatus(req: Request, res: Response) {
  try {
    const adminCheck = await query(
      'SELECT id, is_active FROM users WHERE username = $1',
      ['admin']
    );

    const isSetup = adminCheck.rows.length > 0 && adminCheck.rows[0].is_active;

    res.json({
      isSetup,
      message: isSetup 
        ? 'System is configured. Admin account is active.' 
        : 'System needs initial setup. Admin account is not active.'
    });
  } catch (error) {
    console.error('Check setup status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
