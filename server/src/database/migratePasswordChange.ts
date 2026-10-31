import { query } from './pool';

async function migratePasswordChange() {
  console.log('🚀 Starting password change migration...');

  try {
    // اضافه کردن ستون must_change_password به جدول users
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE
    `);
    console.log('✅ Users table updated with must_change_password column');

    // به‌روزرسانی admin برای نیاز به تغییر رمز
    await query(`
      UPDATE users 
      SET must_change_password = TRUE 
      WHERE username = 'admin'
    `);
    console.log('✅ Admin user marked for password change');

    console.log('🎉 Password change migration completed successfully!');
  } catch (error) {
    console.error('❌ Password change migration failed:', error);
    process.exit(1);
  }
}

migratePasswordChange();
