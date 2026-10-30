import { Request, Response } from 'express';
import { query } from '../database/pool';
import { AuthRequest } from '../middleware/auth';

// دریافت همه اعلان‌ها
export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const result = await query(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ایجاد اعلان جدید
export async function createNotification(req: AuthRequest, res: Response) {
  try {
    const { message } = req.body;
    const sender = req.user!.fullName;

    const result = await query(
      `INSERT INTO notifications (message, sender)
       VALUES ($1, $2)
       RETURNING *`,
      [message, sender]
    );

    // ثبت در audit log
    await query(
      `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
       VALUES ($1, $2, 'create', 'Notification', $3, 'Notification sent')`,
      [req.user!.id, sender, result.rows[0].id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// علامت‌گذاری به عنوان خوانده شده
export async function markAsRead(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// علامت‌گذاری همه به عنوان خوانده شده
export async function markAllAsRead(req: AuthRequest, res: Response) {
  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE');

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// حذف اعلان
export async function deleteNotification(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM notifications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
