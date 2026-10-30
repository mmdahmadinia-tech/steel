import { Request, Response } from 'express';
import { query, transaction } from '../database/pool';
import { AuthRequest } from '../middleware/auth';

// دریافت همه ذوب‌ها با فیلتر و pagination
export async function getHeats(req: Request, res: Response) {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      shift,
      grade,
      dateStart,
      dateEnd,
      status,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (search) {
      whereClause += ` AND h.heat_id ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (shift) {
      whereClause += ` AND h.shift = $${paramCount}`;
      params.push(shift);
      paramCount++;
    }

    if (grade) {
      whereClause += ` AND h.steel_grade = $${paramCount}`;
      params.push(grade);
      paramCount++;
    }

    if (dateStart) {
      whereClause += ` AND h.date >= $${paramCount}`;
      params.push(dateStart);
      paramCount++;
    }

    if (dateEnd) {
      whereClause += ` AND h.date <= $${paramCount}`;
      params.push(dateEnd);
      paramCount++;
    }

    if (status) {
      whereClause += ` AND (h.eaf_status = $${paramCount} OR h.lf_status = $${paramCount} OR h.ccm_status = $${paramCount})`;
      params.push(status);
      paramCount++;
    }

    // دریافت تعداد کل
    const countResult = await query(
      `SELECT COUNT(*) FROM heats h ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // دریافت داده‌ها
    params.push(Number(limit), offset);
    const result = await query(
      `SELECT 
        h.*,
        eaf.data as eaf_data,
        lf.data as lf_data,
        ccm.data as ccm_data
       FROM heats h
       LEFT JOIN eaf_data eaf ON h.heat_id = eaf.heat_id
       LEFT JOIN lf_data lf ON h.heat_id = lf.heat_id
       LEFT JOIN ccm_data ccm ON h.heat_id = ccm.heat_id
       ${whereClause}
       ORDER BY h.id DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      params
    );

    res.json({
       result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get heats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// دریافت یک ذوب
export async function getHeat(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT 
        h.*,
        eaf.data as eaf_data,
        lf.data as lf_data,
        ccm.data as ccm_data
       FROM heats h
       LEFT JOIN eaf_data eaf ON h.heat_id = eaf.heat_id
       LEFT JOIN lf_data lf ON h.heat_id = lf.heat_id
       LEFT JOIN ccm_data ccm ON h.heat_id = ccm.heat_id
       WHERE h.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Heat not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get heat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ایجاد ذوب جدید
export async function createHeat(req: AuthRequest, res: Response) {
  try {
    const { heatId, date, shift, steelGrade } = req.body;

    // بررسی تکراری نبودن heat_id
    const existing = await query(
      'SELECT id FROM heats WHERE heat_id = $1',
      [heatId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Heat ID already exists' });
    }

    // ایجاد ذوب در transaction
    const result = await transaction(async (client) => {
      // ایجاد ذوب
      const heatResult = await client.query(
        `INSERT INTO heats (heat_id, date, shift, steel_grade)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [heatId, date, shift, steelGrade]
      );

      // ثبت در audit log
      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
         VALUES ($1, $2, 'create', 'Heat', $3, 'Heat created')`,
        [req.user!.id, req.user!.fullName, heatId]
      );

      return heatResult.rows[0];
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create heat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// به‌روزرسانی ذوب
export async function updateHeat(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { eafStatus, lfStatus, ccmStatus, warnings } = req.body;

    const result = await transaction(async (client) => {
      // به‌روزرسانی ذوب
      const heatResult = await client.query(
        `UPDATE heats 
         SET eaf_status = COALESCE($1, eaf_status),
             lf_status = COALESCE($2, lf_status),
             ccm_status = COALESCE($3, ccm_status),
             warnings = COALESCE($4, warnings),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [eafStatus, lfStatus, ccmStatus, warnings, id]
      );

      if (heatResult.rows.length === 0) {
        throw new Error('Heat not found');
      }

      // ثبت در audit log
      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
         VALUES ($1, $2, 'edit', 'Heat', $3, 'Heat updated')`,
        [req.user!.id, req.user!.fullName, id]
      );

      return heatResult.rows[0];
    });

    res.json(result);
  } catch (error) {
    console.error('Update heat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// حذف ذوب
export async function deleteHeat(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    await transaction(async (client) => {
      // حذف ذوب (cascade حذف داده‌های مرتبط)
      const result = await client.query(
        'DELETE FROM heats WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        throw new Error('Heat not found');
      }

      // ثبت در audit log
      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
         VALUES ($1, $2, 'delete', 'Heat', $3, 'Heat deleted')`,
        [req.user!.id, req.user!.fullName, id]
      );
    });

    res.json({ message: 'Heat deleted successfully' });
  } catch (error) {
    console.error('Delete heat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// حذف همه ذوب‌ها
export async function deleteAllHeats(req: AuthRequest, res: Response) {
  try {
    await transaction(async (client) => {
      // حذف همه ذوب‌ها
      await client.query('DELETE FROM heats');

      // ثبت در audit log
      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, details)
         VALUES ($1, $2, 'delete', 'Heat', 'All heats deleted')`,
        [req.user!.id, req.user!.fullName]
      );
    });

    res.json({ message: 'All heats deleted successfully' });
  } catch (error) {
    console.error('Delete all heats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ذخیره داده‌های EAF
export async function saveEAFData(req: AuthRequest, res: Response) {
  try {
    const { heatId } = req.params;
    const data = req.body;

    await transaction(async (client) => {
      // ذخیره داده‌ها
      await client.query(
        `INSERT INTO eaf_data (heat_id, data)
         VALUES ($1, $2)
         ON CONFLICT (heat_id) 
         DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
        [heatId, JSON.stringify(data)]
      );

      // به‌روزرسانی وضعیت
      await client.query(
        `UPDATE heats SET eaf_status = 'completed', updated_at = CURRENT_TIMESTAMP
         WHERE heat_id = $1`,
        [heatId]
      );

      // ثبت در audit log
      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
         VALUES ($1, $2, 'edit', 'EAF', $3, 'EAF data saved')`,
        [req.user!.id, req.user!.fullName, heatId]
      );
    });

    res.json({ message: 'EAF data saved successfully' });
  } catch (error) {
    console.error('Save EAF data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ذخیره داده‌های LF
export async function saveLFData(req: AuthRequest, res: Response) {
  try {
    const { heatId } = req.params;
    const data = req.body;

    await transaction(async (client) => {
      await client.query(
        `INSERT INTO lf_data (heat_id, data)
         VALUES ($1, $2)
         ON CONFLICT (heat_id) 
         DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
        [heatId, JSON.stringify(data)]
      );

      await client.query(
        `UPDATE heats SET lf_status = 'completed', updated_at = CURRENT_TIMESTAMP
         WHERE heat_id = $1`,
        [heatId]
      );

      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
         VALUES ($1, $2, 'edit', 'LF', $3, 'LF data saved')`,
        [req.user!.id, req.user!.fullName, heatId]
      );
    });

    res.json({ message: 'LF data saved successfully' });
  } catch (error) {
    console.error('Save LF data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ذخیره داده‌های CCM
export async function saveCCMData(req: AuthRequest, res: Response) {
  try {
    const { heatId } = req.params;
    const data = req.body;

    await transaction(async (client) => {
      await client.query(
        `INSERT INTO ccm_data (heat_id, data)
         VALUES ($1, $2)
         ON CONFLICT (heat_id) 
         DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
        [heatId, JSON.stringify(data)]
      );

      await client.query(
        `UPDATE heats SET ccm_status = 'completed', updated_at = CURRENT_TIMESTAMP
         WHERE heat_id = $1`,
        [heatId]
      );

      await client.query(
        `INSERT INTO audit_logs (user_id, user_name, action, record_type, record_id, details)
         VALUES ($1, $2, 'edit', 'CCM', $3, 'CCM data saved')`,
        [req.user!.id, req.user!.fullName, heatId]
      );
    });

    res.json({ message: 'CCM data saved successfully' });
  } catch (error) {
    console.error('Save CCM data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// دریافت Heat ID بعدی
export async function getNextHeatId(req: Request, res: Response) {
  try {
    const result = await query(
      'SELECT MAX(CAST(heat_id AS INTEGER)) as max_id FROM heats WHERE heat_id ~ \'^[0-9]+$\'',
      []
    );

    const maxId = result.rows[0].max_id || 0;
    const nextId = String(maxId + 1);

    res.json({ nextHeatId: nextId });
  } catch (error) {
    console.error('Get next heat ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
