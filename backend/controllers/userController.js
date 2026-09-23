import { pool } from '../db.js';
export async function listUsers(req,res){
  try { const [rows]=await pool.query('SELECT id,name,email,role,created_at FROM users ORDER BY name'); res.json(rows); }
  catch { res.status(500).json({message:'Failed to fetch users'}); }
}
