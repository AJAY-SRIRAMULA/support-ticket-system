import { pool } from '../db.js';

async function ownsOrAgent(req, ticketId) {
  const [rows] = await pool.query('SELECT user_id FROM tickets WHERE id=?', [ticketId]);
  if (!rows.length) return null;
  return req.user.role === 'agent' || rows[0].user_id === req.user.id;
}
export async function listComments(req,res) {
  try {
    const allowed = await ownsOrAgent(req, req.params.id);
    if (allowed === null) return res.status(404).json({message:'Ticket not found'});
    if (!allowed) return res.status(403).json({message:'Forbidden'});
    const [rows]=await pool.query('SELECT tc.*, u.name AS user_name, u.role FROM ticket_comments tc JOIN users u ON u.id=tc.user_id WHERE tc.ticket_id=? ORDER BY tc.created_at ASC',[req.params.id]);
    res.json(rows);
  } catch { res.status(500).json({message:'Failed to fetch comments'}); }
}
export async function addComment(req,res) {
  try {
    const allowed=await ownsOrAgent(req,req.params.id);
    if (allowed===null) return res.status(404).json({message:'Ticket not found'});
    if (!allowed) return res.status(403).json({message:'Forbidden'});
    if (!req.body.comment?.trim()) return res.status(400).json({message:'Comment is required'});
    const [result]=await pool.query('INSERT INTO ticket_comments (ticket_id,user_id,comment) VALUES (?,?,?)',[req.params.id,req.user.id,req.body.comment.trim()]);
    const [rows]=await pool.query('SELECT tc.*,u.name AS user_name,u.role FROM ticket_comments tc JOIN users u ON u.id=tc.user_id WHERE tc.id=?',[result.insertId]);
    res.status(201).json(rows[0]);
  } catch { res.status(500).json({message:'Failed to add comment'}); }
}
