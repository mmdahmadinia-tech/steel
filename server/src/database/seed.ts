import { query } from './pool';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // ایجاد فقط Admin اولیه (بدون رمز عبور - باید با Setup فعال شود)
    await query(
      `INSERT INTO users (username, password_hash, full_name, role, is_active, unit_access)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (username) DO NOTHING`,
      ['admin', 'NOT_SET', 'Super Admin', 'admin', false, ['EAF', 'LF', 'CCM']]
    );
    
    console.log('✅ Initial admin account created (inactive)');
    console.log('⚠️  Admin account needs to be activated via Setup process');

    console.log('🎉 Seed completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Generate setup token: POST /api/setup/generate-token');
    console.log('2. Activate admin: POST /api/setup/activate');
    console.log('3. Login with admin credentials');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
