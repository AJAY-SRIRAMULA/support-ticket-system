USE support_ticket_system;
SELECT t.id, t.subject, t.priority, t.status, u.name AS customer_name, u.email AS customer_email
FROM tickets t
JOIN users u ON u.id = t.user_id
WHERE t.status IN ('Open','In Progress')
ORDER BY t.created_at DESC;
