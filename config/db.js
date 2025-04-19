import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL; // Use env variable

const sql = postgres(connectionString, {
  ssl: 'require',
});

export default sql;
