import { query } from './pool';

async function migrate() {
  console.log('🚀 Starting database migration...');

  try {
    // جدول کاربران
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'eaf_user', 'lf_user', 'ccm_user', 'analyst')),
        is_active BOOLEAN DEFAULT TRUE,
        unit_access TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // جدول ذوب‌ها
    await query(`
      CREATE TABLE IF NOT EXISTS heats (
        id SERIAL PRIMARY KEY,
        heat_id VARCHAR(50) UNIQUE NOT NULL,
        date VARCHAR(20) NOT NULL,
        shift VARCHAR(10) NOT NULL,
        steel_grade VARCHAR(20) NOT NULL,
        is_sub_heat BOOLEAN DEFAULT FALSE,
        parent_heat_id VARCHAR(50),
        eaf_status VARCHAR(20) DEFAULT 'not_started',
        lf_status VARCHAR(20) DEFAULT 'not_started',
        ccm_status VARCHAR(20) DEFAULT 'not_started',
        warnings TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Heats table created');

    // جدول داده‌های EAF
    await query(`
      CREATE TABLE IF NOT EXISTS eaf_data (
        id SERIAL PRIMARY KEY,
        heat_id VARCHAR(50) REFERENCES heats(heat_id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(heat_id)
      )
    `);
    console.log('✅ EAF data table created');

    // جدول داده‌های LF
    await query(`
      CREATE TABLE IF NOT EXISTS lf_data (
        id SERIAL PRIMARY KEY,
        heat_id VARCHAR(50) REFERENCES heats(heat_id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(heat_id)
      )
    `);
    console.log('✅ LF data table created');

    // جدول داده‌های CCM
    await query(`
      CREATE TABLE IF NOT EXISTS ccm_data (
        id SERIAL PRIMARY KEY,
        heat_id VARCHAR(50) REFERENCES heats(heat_id) ON DELETE CASCADE,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(heat_id)
      )
    `);
    console.log('✅ CCM data table created');

    // جدول اعلان‌ها
    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        sender VARCHAR(100) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Notifications table created');

    // جدول سوابق تغییرات
    await query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_name VARCHAR(100) NOT NULL,
        action VARCHAR(20) NOT NULL,
        record_type VARCHAR(50) NOT NULL,
        record_id VARCHAR(50),
        details TEXT,
        old_value JSONB,
        new_value JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Audit logs table created');

    // جدول پشتیبان‌ها
    await query(`
      CREATE TABLE IF NOT EXISTS backups (
        id SERIAL PRIMARY KEY,
        backup_type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        file_size VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Backups table created');

    // ایجاد Index‌ها برای سرعت بیشتر
    await query(`CREATE INDEX IF NOT EXISTS idx_heats_date ON heats(date)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_heats_shift ON heats(shift)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_heats_grade ON heats(steel_grade)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_heats_eaf_status ON heats(eaf_status)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC)`);
    console.log('✅ Indexes created');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
