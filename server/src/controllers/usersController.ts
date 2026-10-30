import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../database/pool';
import { AuthRequest } from '../middleware/auth';

// دریافت همه کاربران
export async function getUsers(req: AuthRequest, res: Response) {
  try {
    const result = await query(
      'SELECT id, username, full_name, role, unit_access, is_active, created_at FROM users ORDER BY id'
    );

    const users = result.rows.map(user => ({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      unitAccess: user.unit_access,
      isActive: user.is_active,
      createdAt: user.created_at,
    }));

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ایجاد کاربر جدید
export async function createUser(req: AuthRequest, res: Response) {
  try {
    const { username, password, fullName, role, unitAccess } = req.body;

    // بررسی تکراری نبودن username
    const existing = await query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // رمزگذاری رمز عبور
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // ایجاد کاربر
    const result = await query(
      `INSERT INTO users (username, password_hash, full_name, role, unit_access)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, full_name, role, unit_access, is_active`,
      [username, passwordHash, fullName, role, unitAccess]
    );

    const user = result.rows[0];

    // ثبت در audit log
    await query(
      `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
       VALUES ($1, $2, 'create', 'User', $3, 'User created')`,
      [req.user!.id, req.user!.fullName, user.id]
    );

    res.status(201).json({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      unitAccess: user.unit_access,
      isActive: user.is_active,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// به‌روزرسانی کاربر
export async function updateUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { fullName, role, unitAccess, isActive } = req.body;

    const result = await query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           role = COALESCE($2, role),
           unit_access = COALESCE($3, unit_access),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, username, full_name, role, unit_access, is_active`,
      [fullName, role, unitAccess, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // ثبت در audit log
    await query(
      `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
       VALUES ($1, $2, 'edit', 'User', $3, 'User updated')`,
      [req.user!.id, req.user!.fullName, id]
    );

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
      unitAccess: user.unit_access,
      isActive: user.is_active,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// حذف کاربر
export async function deleteUser(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    // جلوگیری از حذف خود
    if (Number(id) === req.user!.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ثبت در audit log
    await query(
      `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
       VALUES ($1, $2, 'delete', 'User', $3, 'User deleted')`,
      [req.user!.id, req.user!.fullName, id]
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
