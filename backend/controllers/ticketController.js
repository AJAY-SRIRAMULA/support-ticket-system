import { pool } from '../db.js';

const allowedPriority = ['Low', 'Medium', 'High', 'Critical'];
const allowedStatus = ['Open', 'In Progress', 'Resolved', 'Closed'];

function ticketScope(req) {
  return req.user.role === 'customer'
    ? { sql: ' WHERE t.user_id = ?', params: [req.user.id] }
    : { sql: '', params: [] };
}

export async function listTickets(req, res) {
  try {
    const {
      search = '',
      status,
      priority,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const allowedSort = {
      created_at: 't.created_at',
      updated_at: 't.updated_at',
      priority: 't.priority',
      status: 't.status',
      subject: 't.subject'
    };

    let sql = `
      SELECT
        t.*,
        c.name AS customer_name,
        c.email AS customer_email,
        a.name AS agent_name
      FROM tickets t
      JOIN users c ON c.id = t.user_id
      LEFT JOIN users a ON a.id = t.assigned_to
    `;

    const clauses = [];
    const params = [];

    if (req.user.role === 'customer') {
      clauses.push('t.user_id = ?');
      params.push(req.user.id);
    }

    if (search) {
      clauses.push(
        '(t.subject LIKE ? OR t.description LIKE ? OR c.name LIKE ? OR c.email LIKE ?)'
      );

      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (status) {
      clauses.push('t.status = ?');
      params.push(status);
    }

    if (priority) {
      clauses.push('t.priority = ?');
      params.push(priority);
    }

    if (clauses.length) {
      sql += ' WHERE ' + clauses.join(' AND ');
    }

    sql += `
      ORDER BY ${
        allowedSort[sort] || allowedSort.created_at
      } ${
        String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
      }
    `;

    const [rows] = await pool.query(sql, params);

    res.json(rows);
  } catch {
    res.status(500).json({
      message: 'Failed to fetch tickets'
    });
  }
}

export async function getTicket(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT
        t.*,
        c.name AS customer_name,
        c.email AS customer_email,
        a.name AS agent_name
      FROM tickets t
      JOIN users c ON c.id = t.user_id
      LEFT JOIN users a ON a.id = t.assigned_to
      WHERE t.id = ?
      `,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'Ticket not found'
      });
    }

    if (
      req.user.role === 'customer' &&
      Number(rows[0].user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: 'You cannot access another customer’s ticket'
      });
    }

    res.json(rows[0]);
  } catch {
    res.status(500).json({
      message: 'Failed to fetch ticket'
    });
  }
}

export async function createTicket(req, res) {
  try {
    const {
      subject,
      description,
      priority = 'Medium'
    } = req.body;

    if (
      !subject?.trim() ||
      !description?.trim() ||
      !allowedPriority.includes(priority)
    ) {
      return res.status(400).json({
        message: 'Subject, description and valid priority are required'
      });
    }

    const [result] = await pool.query(
      `
      INSERT INTO tickets
      (user_id, subject, description, priority, status)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        subject.trim(),
        description.trim(),
        priority,
        'Open'
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM tickets WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({
      message: 'Failed to create ticket'
    });
  }
}

export async function updateTicket(req, res) {
  try {
    const [current] = await pool.query(
      'SELECT * FROM tickets WHERE id = ?',
      [req.params.id]
    );

    if (!current.length) {
      return res.status(404).json({
        message: 'Ticket not found'
      });
    }

    if (
      req.user.role === 'customer' &&
      Number(current[0].user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: 'Forbidden'
      });
    }

    const {
      status,
      priority,
      assigned_to
    } = req.body;

    if (
      status !== undefined &&
      !allowedStatus.includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }

    if (
      priority !== undefined &&
      !allowedPriority.includes(priority)
    ) {
      return res.status(400).json({
        message: 'Invalid priority'
      });
    }

    if (
      req.user.role === 'customer' &&
      (
        status !== undefined ||
        priority !== undefined ||
        assigned_to !== undefined
      )
    ) {
      return res.status(403).json({
        message: 'Customers cannot modify ticket management fields'
      });
    }

    const updates = [];
    const params = [];

    if (req.user.role === 'agent') {
      if (status !== undefined) {
        updates.push('status = ?');
        params.push(status);
      }

      if (priority !== undefined) {
        updates.push('priority = ?');
        params.push(priority);
      }

      if (assigned_to !== undefined) {
        if (assigned_to !== null) {
          const [agent] = await pool.query(
            'SELECT id FROM users WHERE id = ? AND role = "agent"',
            [assigned_to]
          );

          if (!agent.length) {
            return res.status(400).json({
              message: 'assigned_to must reference an agent'
            });
          }
        }

        updates.push('assigned_to = ?');
        params.push(assigned_to);
      }
    }

    if (!updates.length) {
      return res.status(400).json({
        message: 'No permitted fields to update'
      });
    }

    params.push(req.params.id);

    await pool.query(
      `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    const [rows] = await pool.query(
      'SELECT * FROM tickets WHERE id = ?',
      [req.params.id]
    );

    res.json(rows[0]);
  } catch {
    res.status(500).json({
      message: 'Failed to update ticket'
    });
  }
}

export async function deleteTicket(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT user_id FROM tickets WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: 'Ticket not found'
      });
    }

    if (
      req.user.role !== 'customer' ||
      Number(rows[0].user_id) !== Number(req.user.id)
    ) {
      return res.status(403).json({
        message: 'Only the ticket owner can delete this ticket'
      });
    }

    await pool.query(
      'DELETE FROM tickets WHERE id = ?',
      [req.params.id]
    );

    res.json({
      message: 'Ticket deleted'
    });
  } catch {
    res.status(500).json({
      message: 'Failed to delete ticket'
    });
  }
}