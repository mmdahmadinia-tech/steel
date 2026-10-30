import bcrypt from 'bcryptjs';
import { query } from './pool';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // رمزگذاری رمزهای عبور
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      {
        username: '19029',
        password: '19029',
        fullName: 'مدیر سایت',
        role: 'admin',
        unitAccess: ['EAF', 'LF', 'CCM'],
      },
      {
        username: '19377',
        password: '19377',
        fullName: 'کاربر EAF',
        role: 'eaf_user',
        unitAccess: ['EAF'],
      },
      {
        username: '19513',
        password: '19513',
        fullName: 'کاربر LF',
        role: 'lf_user',
        unitAccess: ['LF'],
      },
      {
        username: '19616',
        password: '19616',
        fullName: 'کاربر CCM',
        role: 'ccm_user',
        unitAccess: ['CCM'],
      },
      {
        username: '19452',
        password: '19452',
        fullName: 'کاربر تحلیل',
        role: 'analyst',
        unitAccess: ['EAF', 'LF', 'CCM'],
      },
    ];

    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, salt);
      
      await query(
        `INSERT INTO users (username, password_hash, full_name, role, unit_access)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO NOTHING`,
        [user.username, passwordHash, user.fullName, user.role, user.unitAccess]
      );
      
      console.log(`✅ User ${user.username} created`);
    }

    // ایجاد چند ذوب نمونه
    const sampleHeats = [
      {
        heatId: '1250',
        date: '1403/09/15',
        shift: 'A',
        steelGrade: '4402',
      },
      {
        heatId: '1251',
        date: '1403/09/15',
        shift: 'A',
        steelGrade: '3203',
      },
      {
        heatId: '1252',
        date: '1403/09/15',
        shift: 'B',
        steelGrade: '3401',
      },
    ];

    for (const heat of sampleHeats) {
      await query(
        `INSERT INTO heats (heat_id, date, shift, steel_grade)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (heat_id) DO NOTHING`,
        [heat.heatId, heat.date, heat.shift, heat.steelGrade]
      );
      
      console.log(`✅ Heat ${heat.heatId} created`);
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
