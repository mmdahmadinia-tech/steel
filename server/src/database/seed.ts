import bcrypt from 'bcryptjs';
import { query } from './pool';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // بررسی وجود admin
    const existingAdmin = await query(
      'SELECT id, username, must_change_password FROM users WHERE username = $1',
      ['admin']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  Admin account already exists');
      console.log('⚠️  Password will NOT be reset');
      console.log('');
      console.log('📋 Existing admin credentials:');
      console.log('   Username: admin');
      console.log('   Password: [current password - not changed]');
      
      // اگر admin وجود دارد ولی must_change_password false است، آن را true کنیم
      if (!existingAdmin.rows[0].must_change_password) {
        await query(
          'UPDATE users SET must_change_password = TRUE WHERE username = $1',
          ['admin']
        );
        console.log('   ⚠️  Password change flag set to TRUE');
      }
      
      console.log('');
      console.log('🎉 Seed completed (admin already existed)');
      return;
    }

    // ایجاد Admin با رمز اولیه 123456 (فقط برای development)
    const salt = await bcrypt.genSalt(12);
    const initialPassword = '123456';
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    await query(
      `INSERT INTO users (username, password_hash, full_name, role, is_active, must_change_password, unit_access)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      ['admin', passwordHash, 'Super Admin', 'admin', true, true, ['EAF', 'LF', 'CCM']]
    );
    
    console.log('✅ Admin account created with initial password: 123456');
    console.log('⚠️  Admin must change password on first login');

    console.log('🎉 Seed completed successfully!');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: 123456');
    console.log('   ⚠️  Password change required on first login');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
