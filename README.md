# Support Ticket Management System

A full-stack support portal for customers and support agents, built for the Junior Full Stack Developer Technical Assessment.

## Live Demo

* **Frontend:** https://support-ticket-system-rose.vercel.app/
* **Backend:** https://support-ticket-system-90a8.onrender.com
* **Backend Health Check:** https://support-ticket-system-90a8.onrender.com/api/health
* **GitHub Repository:** https://github.com/AJAY-SRIRAMULA/support-ticket-system

## Tech Stack

* React + Vite
* Node.js + Express
* MySQL
* JWT authentication
* bcrypt password hashing
* Axios
* Jest + Supertest
* Postman
* Git + GitHub
* Vercel
* Render
* Aiven MySQL

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
* Update ticket status and priority
* Assign tickets to an agent
* Add responses/comments

## Database

The application uses MySQL with three main tables:

* `users`
* `tickets`
* `ticket_comments`

The database includes:

* Primary keys
* Foreign keys
* One-to-many relationships
* Indexes
* Cascading relationships
* Parameterized SQL queries

### Database Setup

Open MySQL Workbench and run:

```text
database/schema.sql
```

Then run:

```text
database/seed.sql
```

The seed creates demo accounts:

```text
Customer:
customer@example.com
Password123

Agent:
agent@example.com
Password123
```

These credentials are for assessment/demo purposes only.

## Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add your local MySQL configuration and a private JWT secret:

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

The local API runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Frontend Setup

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

## Automated Tests

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

## Postman

Import the following collection into Postman:

```text
postman/support-ticket-system.json
```

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

The collection can be configured with the deployed API base URL and authentication tokens.

## Security

* Passwords are hashed using bcrypt.
* JWTs protect authenticated backend APIs.
* Customer ticket ownership is checked server-side.
* Role-based authorization protects agent-only functionality.
* SQL queries use parameterized placeholders.
* Secrets are stored in environment variables.
* `.env` files are excluded from Git.
* CORS is configured using the `CLIENT_URL` environment variable.
* Customers cannot access another customer's tickets.
* Unauthorized requests return appropriate HTTP status codes.

## Deployment

The application is deployed using:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Aiven MySQL

### Live URLs

**Frontend**

https://support-ticket-system-rose.vercel.app/

**Backend**

https://support-ticket-system-90a8.onrender.com

**Health Check**

https://support-ticket-system-90a8.onrender.com/api/health

**GitHub**

https://github.com/AJAY-SRIRAMULA/support-ticket-system

### Deployment Verification

The following production flows have been verified:

* Customer registration and login
* Agent login
* Customer ticket creation
* Customer ticket ownership
* Agent ticket management
* Ticket status updates
* Ticket priority updates
* Agent assignment
* Ticket comments
* JWT authentication
* Role-based authorization
* MySQL cloud database connection
* Frontend-to-backend API communication
* CORS configuration
* API error handling

## REST API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Tickets

```text
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
DELETE /api/tickets/:id
```

### Comments

```text
GET  /api/tickets/:id/comments
POST /api/tickets/:id/comments
```

### Users

```text
GET /api/users
```

### Health Check

```text
GET /api/health
```

## SQL Example

The project includes a SQL query demonstrating a JOIN between tickets and customers:

```text
database/open_tickets_query.sql
```

The query retrieves open and in-progress tickets along with customer name and email.

## Project Structure

```text
support-ticket-system/

├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── tests/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── open_tickets_query.sql
│
├── postman/
│   └── support-ticket-system.json
│
├── .env.example
├── .gitignore
└── README.md
```

## Demo Credentials

### Customer

```text
Email: customer@example.com
Password: Password123
Role: Customer
```

### Support Agent

```text
Email: agent@example.com
Password: Password123
Role: Agent
```

These credentials are provided only for assessment/demo purposes.

## GitHub

The complete source code, database scripts, Postman collection, tests and documentation are available in the GitHub repository:

https://github.com/AJAY-SRIRAMULA/support-ticket-system
