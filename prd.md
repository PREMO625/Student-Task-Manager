# Product Requirements Document (PRD)

# Student Task Manager

## 1. Product Overview

Student Task Manager is a full-stack productivity web app that helps students organize assignments, track deadlines, manage priorities, and monitor completion progress. The product should feel modern, fast, responsive, and production-ready.

Primary goal: reduce missed deadlines and help students stay consistent.

## 2. Core Objectives

* Create, edit, delete tasks
* Organize tasks by subject/course
* Track due dates and urgency
* Mark tasks complete/incomplete
* View progress analytics
* Search and filter tasks quickly
* Secure authentication
* Deployable frontend + backend architecture

## 3. Tech Stack (Mandatory)

## Frontend

* Next.js (latest stable, App Router)
* TypeScript
* Tailwind CSS
* Shadcn/ui
* React Hook Form
* Zod validation
* Axios
* Recharts (analytics)
* Framer Motion

## Backend

* Node.js
* Express.js
* TypeScript preferred
* JWT Authentication
* Bcrypt
* MongoDB + Mongoose
* Helmet
* CORS
* Express Rate Limit
* Morgan logger
* dotenv

## Database

* MongoDB Atlas

## Deployment

* Frontend: Vercel
* Backend: Render

## Important Build Instruction

Before implementation, generate `doc.md` containing latest patterns / setup notes / conventions for all chosen technologies. Then read both `prd.md` + `doc.md` and generate the complete project in second run.

## Claude Agent Instruction

Use:
`npx skills add https://github.com/anthropics/skills --skill frontend-design`
Apply it for polished, responsive, modern UI.

---

# 4. User Roles

## Student User

Only one role required for MVP.
Capabilities:

* Register / Login
* Manage tasks
* View dashboard
* Update profile
* Logout

---

# 5. Main Features

## 5.1 Authentication

Pages:

* Register
* Login

Requirements:

* Name, email, password
* Password hashed with bcrypt
* JWT token auth
* Protected routes
* Persistent login
* Logout functionality
* Friendly validation messages

## 5.2 Dashboard

Main landing page after login.
Widgets:

* Total Tasks
* Pending Tasks
* Completed Tasks
* Overdue Tasks
* Completion Rate %
* Upcoming Deadlines
* Productivity chart

## 5.3 Task CRUD

Task fields:

* title (required)
* description (optional)
* subject (required)
* priority (Low / Medium / High)
* status (Pending / Completed)
* dueDate
* estimatedTime (minutes)
* tags (optional array)
* createdAt
* updatedAt
* userId

Actions:

* Create task
* Edit task
* Delete task
* Mark complete
* Duplicate task
* Bulk delete selected tasks

## 5.4 Smart Task Views

Views:

* All Tasks
* Today
* Upcoming
* Overdue
* Completed
* High Priority
* By Subject

## 5.5 Search + Filters

Filters:

* Search by title/subject
* Filter by status
* Filter by priority
* Sort by due date
* Sort by created date
* Sort alphabetically

## 5.6 Calendar / Deadline View

Monthly + weekly task deadline display.
Can use lightweight calendar library.

## 5.7 Analytics

Charts using Recharts:

* Tasks completed this week
* Subject-wise distribution
* Pending vs completed pie chart
* Productivity streak

## 5.8 Profile Settings

* Update name
* Update password
* Theme toggle
* Delete account

---

# 6. UI / UX Requirements

## Design Style

* Clean modern SaaS aesthetic
* Student-friendly and motivating
* Rounded cards
* Soft shadows
* Smooth animations
* Responsive spacing
* Minimal clutter

## Pages Required

* Home / Landing
* Register
* Login
* Dashboard
* Tasks Page
* Analytics Page
* Calendar Page
* Profile Page
* 404 Page

## Responsiveness

Must support:

* Mobile
* Tablet
* Laptop
* Desktop

## Accessibility

* Keyboard navigation
* Proper labels
* Focus states
* Semantic HTML

---

# 7. Backend API Requirements

## Base URL

`/api`

## Auth Routes

* POST /auth/register
* POST /auth/login
* GET /auth/me

## Task Routes

* GET /tasks
* POST /tasks
* GET /tasks/:id
* PUT /tasks/:id
* DELETE /tasks/:id
* PATCH /tasks/:id/toggle
* DELETE /tasks/bulk

## Analytics Routes

* GET /analytics/summary
* GET /analytics/charts

## User Routes

* PUT /users/profile
* PUT /users/password
* DELETE /users/account

All protected routes require JWT middleware.

---

# 8. Database Schema

## User Model

* _id
* name
* email (unique)
* passwordHash
* createdAt
* updatedAt

## Task Model

* _id
* userId (ref User)
* title
* description
* subject
* priority
* status
* dueDate
* estimatedTime
* tags[]
* completedAt
* createdAt
* updatedAt

---

# 9. Folder Structure

## Root

* frontend/
* backend/
* prd.md
* doc.md
* README.md

## Frontend

* app/
* components/
* lib/
* hooks/
* types/
* public/
* styles/
* .env.local.template
* vercel.json

## Backend

* src/

  * config/
  * controllers/
  * models/
  * routes/
  * middleware/
  * services/
  * utils/
  * validators/
  * server.ts
* .env.template
* render.yaml (optional)
* package.json

---

# 10. Environment Files

## frontend/.env.local.template

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## backend/.env.template

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

---

# 11. Validation Rules

* Email valid format
* Password min 6 chars
* Task title required
* Subject required
* Due date valid
* Secure server-side validation too

---

# 12. Security Requirements

* Hash passwords
* JWT auth middleware
* Rate limiting
* Helmet headers
* CORS restricted to frontend domain
* Sanitize inputs
* Prevent unauthorized task access

---

# 13. Performance Requirements

* Fast page loads
* Optimistic UI where useful
* Loading skeletons
* Pagination or infinite scroll if task count large
* Debounced search

---

# 14. Error Handling

Frontend:

* Toast messages
* Friendly empty states
* Retry actions

Backend:

* Standard error response format
* Central error middleware
* Proper status codes

---

# 15. Deployment Requirements

## Frontend (Vercel)

Include `vercel.json` configured for Next.js.
Use environment variable for API URL.

## Backend (Render)

* Start command configured
* Environment variables documented
* CORS supports frontend domain

---

# 16. README Requirements

Include:

* Setup steps
* Env setup
* Local run commands
* Build commands
* Deployment steps
* Screenshots placeholders
* API overview

---

# 17. Nice-to-Have Features (If Time Allows)

* Email reminders
* Pomodoro timer
* Recurring tasks
* Drag and drop Kanban board
* AI study planner
* Export tasks CSV/PDF
* Notifications

---

# 18. Success Criteria

Project is successful if:

* Full auth works
* CRUD works reliably
* UI looks premium
* Fully responsive
* MongoDB connected
* Deploys without major changes
* Clean codebase with reusable components
* Works in production

---

# 19. Final Build Command to Agent

1. Create `doc.md` with latest best practices for chosen stack.
2. Read `prd.md` + `doc.md`.
3. Generate full-stack project in one pass.
4. Ensure production-ready code.
5. Ensure beautiful responsive frontend.
6. Include all env templates.
7. Include vercel.json.
8. Structure backend for Render deployment.
