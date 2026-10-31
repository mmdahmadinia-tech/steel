import { query } from './pool';

async function testConnection() {
  console.log('🔍 Testing database connection...');

  try {
    // تست اتصال ساده
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Connected to PostgreSQL successfully!');
    console.log(`   Server time: ${result.rows[0].current_time}`);

    // بررسی وجود Database
    const dbCheck = await query('SELECT current_database()');
    console.log(`   Database: ${dbCheck.rows[0].current_database}`);

    // بررسی وجود جدول users
    const tableCheck = await query(
      `SELECT EXISTS (
         SELECT FROM information_schema.tables 
         WHERE table_name = 'users'
       ) as table_exists`
    );

    if (tableCheck.rows[0].table_exists) {
      console.log('   ✅ Table "users" exists');
      
      // بررسی تعداد کاربران
      const userCount = await query('SELECT COUNT(*) as count FROM users');
      console.log(`   Users count: ${userCount.rows[0].count}`);
    } else {
      console.log('   ⚠️  Table "users" does not exist');
      console.log('   Please run: npm run migrate');
    }

    console.log('');
    console.log('🎉 Database connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('');
    console.error('Error details:');
    if (error instanceof Error) {
      console.error(`  ${error.message}`);
      
      if (error.message.includes('ECONNREFUSED')) {
        console.error('');
        console.error('Possible causes:');
        console.error('  1. PostgreSQL is not running');
        console.error('  2. PostgreSQL is not installed');
        console.error('  3. Port 5432 is blocked');
        console.error('');
        console.error('Solutions:');
        console.error('  1. Start PostgreSQL: net start postgresql-x64-16');
        console.error('  2. Install PostgreSQL from: https://www.postgresql.org/download/windows/');
        console.error('  3. Check firewall settings');
      } else if (error.message.includes('password authentication failed')) {
        console.error('');
        console.error('Possible causes:');
        console.error('  1. DB_PASSWORD in server/.env is incorrect');
        console.error('  2. User does not exist');
        console.error('');
        console.error('Solutions:');
        console.error('  1. Check server/.env credentials');
        console.error('  2. Verify PostgreSQL user exists');
      } else if (error.message.includes('database "steelmetrics" does not exist')) {
        console.error('');
        console.error('Possible causes:');
        console.error('  1. Database "steelmetrics" has not been created');
        console.error('');
        console.error('Solutions:');
        console.error('  1. Create database: psql -U postgres -c "CREATE DATABASE steelmetrics;"');
      }
    }
    
    process.exit(1);
  }
}

testConnection();
