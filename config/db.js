// db.js
import postgres from 'postgres';



const connectionString = 'postgresql://postgres.klxuzcwcvhulmdckttju:Parkify@123!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
const sql = postgres(connectionString)

export default sql

