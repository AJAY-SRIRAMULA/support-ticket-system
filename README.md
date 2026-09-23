# Support Ticket Management System

A full-stack support portal for customers and support agents, built for the Junior Full Stack Developer Technical Assessment.

## Stack

* React + Vite
* Node.js + Express
* MySQL
* JWT authentication
* bcrypt password hashing
* Axios
* Jest + Supertest
* Postman

## Features

### Customer

* Register and login
* Protected dashboard with own tickets
* Create tickets with subject, description and priority
* View ticket details and comments
* Add comments/responses
* Search and filter tickets
* Cannot access another customer's ticket

### Support Agent

* Login
* Dashboard statistics
* View all tickets
* Search and filter tickets
* View ticket details and comments
* Update status and priority
* Assign tickets to an agent
* Add responses

## 1. Database Setup

Open MySQL Workbench and run:

```sql
database/schema.sql
```

Then run:

```sql
database/seed.sql
```

The seed creates these demo accounts:

* `customer@example.com` / `Password123`
* `agent@example.com` / `Password123`

These are demo credentials only. Do not use them in production.

## 2. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add your local MySQL configuration and a private JWT secret.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=support_ticket_system
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=YOUR_PRIVATE_JWT_SECRET

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

API:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

## 4. Automated Tests

From the `backend` directory:

```bash
npm test
```

The project includes 8 Jest + Supertest API tests covering:

* Public health endpoint
* Authentication enforcement
* Protected users endpoint
* Invalid login validation
* Registration validation
* Unknown route handling
* Protected ticket creation
* Protected comment creation

All 8 tests pass.

## 5. Postman

Import:

```text
postman/support-ticket-system.json
```

into Postman.

The collection contains 17 requests covering:

* Customer registration
* Customer login
* Invalid login
* Agent login
* Ticket creation
* Get tickets
* Get ticket by ID
* Add comments
* Get comments
* Agent ticket management
* User/agent listing
* Unauthorized access
* Forbidden access
* Invalid input
* Not-found handling

Set the collection variables for the base URL and authentication tokens as required.

## 6. Security

* Passwords are hashed with bcrypt.
* JWTs protect backend APIs.
* Customer ticket ownership is checked server-side.
* Agent-only APIs are protected by role-based authorization.
* SQL queries use parameterized placeholders.
* Secrets are stored in environment variables.
* `.env` files are excluded from Git.
* CORS is configured through `CLIENT_URL`.

## 7. Deployment Checklist

Before final deployment:

1. Provision a managed MySQL database.
2. Set backend environment variables securely.
3. Set frontend `VITE_API_URL` to the deployed API URL.
4. Deploy the backend.
5. Deploy the frontend.
6. Run the database schema on the remote MySQL database.
7. Seed only the required demo data.
8. Verify authentication and authorization.
9. Verify ticket ownership restrictions.
10. Verify comments, ticket updates and API errors.
11. Add the live frontend URL, backend URL and GitHub repository URL to the submission.

## Required REST API Endpoints

* POST `/api/auth/register`
* POST `/api/auth/login`
* GET `/api/tickets`
* POST `/api/tickets`
* GET `/api/tickets/:id`
* PUT `/api/tickets/:id`
* DELETE `/api/tickets/:id`
* GET `/api/tickets/:id/comments`
* POST `/api/tickets/:id/comments`
* GET `/api/users`

## Project Structure

```text
support-ticket-system/

├── backend/
├── frontend/
├── database/
├── postman/
├── .env.example
├── .gitignore
└── README.md
```
