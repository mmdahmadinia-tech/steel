import { Pool, PoolClient } from 'pg';
import { config } from '../config';

// ایجاد connection pool
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20, // حداکثر 20 connection
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// لاگ اتصال
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// تابع برای دریافت client
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}

// تابع برای اجرای query
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (config.nodeEnv === 'development') {
    console.log('Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
  }
  
  return res;
}

// تابع برای transaction
export async function transaction(callback: (client: PoolClient) => Promise<any>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// بستن pool
export async function closePool() {
  await pool.end();
  console.log('🔌 Database pool closed');
}

export default pool;
