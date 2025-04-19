// db.js
import postgres from 'postgres';

const connectionString = 'postgres://postgres:parkify@db.zybbclwbgzdkznvjohko.supabase.co:5432/postgres';
const sql = postgres(connectionString, {
  ssl: 'require',
});

export default sql;
