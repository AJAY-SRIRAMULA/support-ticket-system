USE support_ticket_system;

-- Demo password: password (bcrypt hash; change for any real deployment).
-- This seed is for local assessment/demo use only.

INSERT INTO users (name, email, password_hash, role)
VALUES
(
    'Demo Customer',
    'customer@example.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'customer'
),
(
    'Support Agent',
    'agent@example.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'agent'
)
AS new
ON DUPLICATE KEY UPDATE
    name = new.name;

SET @customer_id = (
    SELECT id
    FROM users
    WHERE email = 'customer@example.com'
);

SET @agent_id = (
    SELECT id
    FROM users
    WHERE email = 'agent@example.com'
);

INSERT INTO tickets
(
    user_id,
    subject,
    description,
    priority,
    status,
    assigned_to
)
SELECT
    @customer_id,
    'Unable to access billing page',
    'The billing page returns an error when I try to open it.',
    'High',
    'Open',
    @agent_id
WHERE NOT EXISTS (
    SELECT 1
    FROM tickets
    WHERE subject = 'Unable to access billing page'
      AND user_id = @customer_id
);

SET @ticket_id = (
    SELECT id
    FROM tickets
    WHERE subject = 'Unable to access billing page'
      AND user_id = @customer_id
    LIMIT 1
);

INSERT INTO ticket_comments
(
    ticket_id,
    user_id,
    comment
)
SELECT
    @ticket_id,
    @agent_id,
    'Thanks for reporting this. We are investigating the billing service.'
WHERE NOT EXISTS (
    SELECT 1
    FROM ticket_comments
    WHERE ticket_id = @ticket_id
);