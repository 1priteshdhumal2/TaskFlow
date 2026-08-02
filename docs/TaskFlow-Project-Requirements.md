# TaskFlow — Project Requirements Document

**A multi-role Project Management / Task Tracker app**
**Scope:** Focused MVP, 1–2 weeks
**Stack:** React (frontend) · Node.js/Express (backend) · PostgreSQL (database)

Every concept on your practice list maps to a specific feature below, so nothing is generic filler — build this and you've drilled all of it.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React (Vite), React Router, TanStack Query, React Context, React Hook Form + Zod |
| Backend | Node.js, Express, jsonwebtoken, bcrypt, multer, express-validator (or Zod), winston (or pino) |
| Database | PostgreSQL (raw SQL or `pg` driver — avoid an ORM for this project so you actually write the SQL) |
| Auth | JWT (access + refresh tokens) |
| File storage | Local disk for MVP (`/uploads`), structured so it's swappable for S3 later |

---

## 2. Core Domain & Roles

Three roles, enforced via RBAC:

- **Admin** — manages users, sees everything, can delete any project/task
- **Manager** — creates projects, assigns tasks, manages members within their own projects
- **Member** — sees assigned tasks, updates status, comments, uploads attachments

Core entities:
- `users` (id, name, email, password_hash, role, created_at)
- `projects` (id, name, description, owner_id → users, status, created_at)
- `project_members` (project_id, user_id, role_in_project) — many-to-many join table
- `tasks` (id, project_id, title, description, status, priority, assignee_id, due_date, created_at, updated_at)
- `task_comments` (id, task_id, user_id, comment, created_at)
- `task_attachments` (id, task_id, file_path, file_name, uploaded_by, uploaded_at)
- `task_activity_log` (id, task_id, user_id, action, old_value, new_value, created_at) — audit trail
- `time_logs` (id, task_id, user_id, hours_spent, log_date) — for reporting/window function practice

---

## 3. Backend Requirements (Node.js / Express)

### 3.1 Express Architecture
- Layered structure: `routes/ → controllers/ → services/ → db/(queries)`
- Centralized `app.js` with route mounting, middleware order, and a single error-handling middleware at the end
- Environment config via `.env` (DB creds, JWT secrets, upload path)

### 3.2 JWT Authentication
- `POST /auth/register`, `POST /auth/login`
- Access token (short-lived, ~15 min) + refresh token (long-lived, stored httpOnly cookie or DB-tracked)
- `POST /auth/refresh` to rotate access tokens
- `POST /auth/logout` invalidates refresh token

### 3.3 RBAC (Role-Based Access Control)
- Middleware `requireRole(['admin', 'manager'])` applied per-route
- Additional resource-level check: a Manager can only edit projects they own; a Member can only update tasks assigned to them
- Example: `DELETE /projects/:id` → Admin only; `PATCH /tasks/:id/status` → assignee or Manager/Admin

### 3.4 File Uploads
- `POST /tasks/:id/attachments` using `multer` (disk storage, file size limit, MIME-type whitelist: pdf, png, jpg, docx)
- `GET /tasks/:id/attachments` lists files; `DELETE /attachments/:id` restricted to uploader or Admin

### 3.5 Validation
- Request body/query validation on every write endpoint (Zod or express-validator)
- Return consistent 422 responses with field-level error messages

### 3.6 Error Handling
- Custom `AppError` class (statusCode, message, isOperational)
- Global error middleware returns consistent JSON shape: `{ success: false, error: { code, message } }`
- Distinguish operational errors (bad input, not found) from programming errors (500, logged but generic message to client)

### 3.7 Logging
- Structured logging with winston/pino: request logs (method, path, status, duration) + error logs
- Separate log levels: info for requests, warn for validation failures, error for exceptions
- Log to console in dev, file (or rotate) in "prod" mode

### 3.8 Pagination
- `GET /tasks?page=1&limit=20` → returns `{ data, pagination: { page, limit, total, totalPages } }`
- Implement with SQL `LIMIT`/`OFFSET` (and try a cursor-based version as a stretch goal)

### 3.9 Filtering
- `GET /tasks?status=in_progress&priority=high&assignee_id=3&project_id=2&search=login`
- Combine multiple optional filters into one dynamic SQL `WHERE` clause safely (parameterized queries — no string concatenation)

---

## 4. SQL Practice — tied directly to features

Build these as real endpoints/reports, not standalone exercises:

| Concept | Where you'll use it |
|---|---|
| **JOIN** | Task list view joining `tasks` + `users` (assignee name) + `projects` (project name) + `COUNT` of comments/attachments |
| **GROUP BY** | Dashboard: "tasks per status per project", "hours logged per user per week" |
| **HAVING** | "Show projects with more than 5 overdue tasks", "users who logged more than 40 hours this month" |
| **Window Functions** | Leaderboard: rank users by tasks completed using `RANK() OVER (PARTITION BY project_id ORDER BY completed_count DESC)`; running total of hours logged with `SUM() OVER (ORDER BY log_date)` |
| **Indexes** | Add indexes on `tasks.project_id`, `tasks.assignee_id`, `tasks.status`; use `EXPLAIN ANALYZE` before/after to see the difference on a seeded dataset of 10k+ rows |
| **Transactions** | Task creation + activity log insert must be atomic; assigning a task must update `tasks.assignee_id` and insert into `task_activity_log` in one transaction with rollback on failure |

**Suggested reporting endpoints to force this practice:**
- `GET /reports/project-summary` — JOIN + GROUP BY + HAVING
- `GET /reports/user-leaderboard` — Window functions
- `GET /reports/overdue-by-project` — JOIN + GROUP BY + HAVING
- `GET /reports/weekly-hours-trend` — Window functions (running/rolling totals)

---

## 5. Frontend Requirements (React)

### 5.1 Custom Hooks
- `useAuth()` — wraps auth context, exposes user, login, logout
- `useTasks(filters)` — wraps TanStack Query for task list + filters/pagination state
- `useDebounce(value, delay)` — for the search filter input
- `useFileUpload()` — handles multipart upload with progress state
- `usePermissions()` — returns booleans like `canEdit`, `canDelete` based on role + resource ownership

### 5.2 Context API
- `AuthContext` — current user, token, login/logout methods (avoid putting server data like task lists in Context — that's React Query's job)
- `ThemeContext` (optional, small extra practice) — light/dark toggle
- Keep Context lean: it's for global client state, not server state

### 5.3 React Query / TanStack Query
- `useQuery` for task lists, project lists, single task detail — with `queryKey` including filters/pagination so caching works correctly
- `useMutation` for create/update/delete task, with `invalidateQueries` or optimistic updates on the task list
- Configure `staleTime` sensibly; handle loading/error states in the UI, not just happy path

### 5.4 Forms
- React Hook Form + Zod schema validation for: Login, Register, Create/Edit Task, Create Project
- Server-side validation errors mapped back into form field errors
- File upload as part of the task form

### 5.5 Authentication (Frontend)
- Store access token in memory (React state/Context), refresh token in httpOnly cookie
- Axios/fetch interceptor to attach token and auto-refresh on 401

### 5.6 Protected Routes
- `<ProtectedRoute roles={['admin','manager']}>` wrapper component using React Router
- Redirect unauthenticated users to `/login`
- Redirect authenticated-but-unauthorized users to a 403 page

### 5.7 Performance Optimization
- `React.memo` on task list row components to avoid re-renders when unrelated state changes
- `useMemo`/`useCallback` for expensive filter/sort computations passed as props
- Virtualization (e.g., `react-window`) if task list grows large in your seed data
- Code-splitting routes with `React.lazy` + `Suspense` (e.g., split the Reports section)
- Debounced search input (ties back to `useDebounce`)

---

## 6. Suggested 10–12 Day Build Plan

| Day | Focus |
|---|---|
| 1 | DB schema + seed script (users, projects, tasks — 10k+ rows for index testing later) |
| 2 | Express skeleton, error handling middleware, logging, JWT auth (register/login/refresh) |
| 3 | RBAC middleware, protected user/project endpoints |
| 4 | Task CRUD + validation + transactions (create task + activity log atomically) |
| 5 | Pagination + filtering endpoints, file upload endpoint |
| 6 | SQL reports: project summary, overdue-by-project (JOIN, GROUP BY, HAVING) |
| 7 | SQL reports: leaderboard, weekly hours trend (window functions) + add indexes, run EXPLAIN ANALYZE |
| 8 | React setup, AuthContext, protected routes, login/register forms |
| 9 | Task list with TanStack Query, filters, pagination UI, custom hooks |
| 10 | Task detail page, comments, file upload UI, create/edit task form |
| 11 | Reports/dashboard UI (charts optional), performance pass (memo, lazy loading, virtualization) |
| 12 | Polish: error boundaries, loading states, seed data cleanup, README |

---

## 7. Stretch Goals (once MVP is solid)
- Cursor-based pagination alongside offset pagination
- Refresh-token rotation with reuse detection
- Rate limiting on auth endpoints
- Real-time task updates (WebSocket or polling via React Query's `refetchInterval`)
- Docker Compose for Postgres + API

---

**Once you confirm this direction, I can help you scaffold the DB schema/migrations, the Express folder structure, or the seed script first — whichever you want to start with.**
