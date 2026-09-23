import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

function signUser(user) {
  return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) return res.status(400).json({ message: 'Name, valid email and password of at least 6 characters are required' });
    const normalized = email.trim().toLowerCase();
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [normalized]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', [name.trim(), normalized, hash, 'customer']);
    const user = { id: result.insertId, name: name.trim(), email: normalized, role: 'customer' };
    res.status(201).json({ message: 'Registration successful', user, token: signUser(user) });
  } catch (e) { res.status(500).json({ message: 'Registration failed' }); }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const [rows] = await pool.query('SELECT id,name,email,password_hash,role FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ message: 'Invalid email or password' });
    const { password_hash, ...user } = rows[0];
    res.json({ message: 'Login successful', user, token: signUser(user) });
  } catch { res.status(500).json({ message: 'Login failed' }); }
}
