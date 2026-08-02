import { pool } from './db';

async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT NOW();');
    console.log('✓ Database Connected');
    process.exit(0);
  } catch (error) {
    console.error('✗ Database Connection Failed:', error);
    process.exit(1);
  }
}

checkDatabaseConnection();
