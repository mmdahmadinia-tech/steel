import { query } from './pool';

async function migrateSetup() {
  console.log('🚀 Starting setup migration...');

  try {
    // ایجاد جدول setup_tokens
    await query(`
      CREATE TABLE IF NOT EXISTS setup_tokens (
        id SERIAL PRIMARY KEY,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Setup tokens table created');

    // ایجاد Index برای جستجوی سریع
    await query(`CREATE INDEX IF NOT EXISTS idx_setup_tokens_token ON setup_tokens(token)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_setup_tokens_expires ON setup_tokens(expires_at)`);
    console.log('✅ Setup tokens indexes created');

    // تغییر جدول users برای اضافه کردن ستون is_active
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE
    `);
    console.log('✅ Users table updated with is_active column');

    // تغییر نقش admin به super_admin
    await query(`
      ALTER TABLE users 
      DROP CONSTRAINT IF EXISTS users_role_check
    `);
    
    await query(`
      ALTER TABLE users 
      ADD CONSTRAINT users_role_check 
      CHECK (role IN ('admin', 'super_admin', 'eaf_user', 'lf_user', 'ccm_user', 'analyst'))
    `);
    console.log('✅ Users role constraint updated');

    console.log('🎉 Setup migration completed successfully!');
  } catch (error) {
    console.error('❌ Setup migration failed:', error);
    process.exit(1);
  }
}

migrateSetup();
