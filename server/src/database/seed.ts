import bcrypt from 'bcryptjs';
import { query } from './pool';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // ایجاد Admin با رمز اولیه 123456 (فقط برای development)
    const salt = await bcrypt.genSalt(12);
    const initialPassword = '123456';
    const passwordHash = await bcrypt.hash(initialPassword, salt);

    await query(
      `INSERT INTO users (username, password_hash, full_name, role, is_active, must_change_password, unit_access)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (username) DO UPDATE 
       SET password_hash = $2, must_change_password = TRUE`,
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
