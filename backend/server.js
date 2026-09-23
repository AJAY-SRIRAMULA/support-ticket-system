import dotenv from 'dotenv'; dotenv.config();
import app from './app.js';
import { pool } from './db.js';
const port=Number(process.env.PORT||5000);
app.listen(port,async()=>{try{await pool.query('SELECT 1');console.log(`Backend running on http://localhost:${port}`);console.log('MySQL connected');}catch(e){console.error('MySQL connection failed:',e.message);}});
