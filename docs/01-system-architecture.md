# TaskFlow System Architecture

**Version:** 1.0

**Status:** Draft

**Project:** TaskFlow

**Author:** Pritesh Dhumal

---

# 1. Purpose

TaskFlow is a full-stack collaborative task management system designed to demonstrate modern software engineering practices using React, Express, TypeScript, and PostgreSQL.

The objective of this project is not only to build a working application but also to showcase software architecture, database design, authentication, authorization, performance optimization, and maintainable code organization.

This document describes the architectural decisions that guide the implementation of the entire system.

---

# 2. System Overview

TaskFlow enables managers to create projects, assign team members, create and manage tasks, collaborate through comments and attachments, track work using time logs, and generate reports.

The application follows a layered architecture with clear separation of responsibilities between the frontend, backend, and database.

High-level capabilities include:

* User Authentication
* Role-Based Access Control (RBAC)
* Project Management
* Task Management
* Multiple Task Assignees
* Comments & Attachments
* Time Tracking
* Activity Logging
* Reporting Dashboard

---

# 3. Architectural Goals

The architecture is designed around the following goals:

* Maintainability
* Scalability
* Separation of Concerns
* Testability
* Security
* Performance
* Clear Business Modeling

Every architectural decision should support one or more of these goals.

---

# 4. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* TanStack Query
* Axios

## Backend

* Node.js
* Express
* TypeScript

## Database

* PostgreSQL

## Authentication

* JWT Access Tokens
* Refresh Tokens
* Session Management

## Development Tools

* ESLint
* Prettier
* Git
* npm Workspaces

---

# 5. High-Level Architecture

The application follows a layered architecture.

```text
React UI
      │
TanStack Query
      │
Axios
      │
──────── HTTP ────────
      │
Express Routes
      │
Authentication Middleware
      │
Authorization (RBAC)
      │
Validation Middleware
      │
Controllers
      │
Services
      │
Repositories
      │
PostgreSQL
```

Each layer has a single responsibility and only communicates with the layer directly below it.

---

# 6. Architectural Principles

## 6.1 Business First

Business requirements drive the software design.

Tables, APIs, and services exist because of business rules, not because of UI screens.

---

## 6.2 Separation of Concerns

Each layer owns a single responsibility.

| Layer        | Responsibility          |
| ------------ | ----------------------- |
| React        | Presentation            |
| React Query  | Server State            |
| Axios        | HTTP Communication      |
| Controllers  | HTTP Request & Response |
| Services     | Business Logic          |
| Repositories | Database Access         |
| PostgreSQL   | Data Persistence        |

---

## 6.3 Feature-First Organization

The backend is organized by business capability rather than file type.

Example:

```
modules/

auth/

projects/

tasks/

reports/
```

This keeps all related files together and improves maintainability as the project grows.

---

## 6.4 Repository Pattern

Business logic never communicates directly with SQL.

Repositories are responsible for interacting with PostgreSQL.

Benefits:

* Better separation of concerns
* Easier testing
* Reusable database logic
* Future flexibility

---

## 6.5 Service Layer

The Service layer owns business rules.

Examples:

* Project ownership transfer
* Task assignment
* Permission validation
* Activity logging
* Business workflows

Controllers should remain thin and only coordinate HTTP communication.

---

## 6.6 Database as Source of Truth

The database stores facts.

Derived values are calculated instead of stored whenever practical.

Example:

The number of tasks inside a project is calculated using SQL rather than stored in the `projects` table.

---

## 6.7 Soft Delete Strategy

Business entities are never permanently removed from the application.

Instead, records are marked using `deleted_at`.

Benefits:

* Auditability
* Recovery
* Historical reporting
* Reduced risk of accidental data loss

---

## 6.8 Auditability

The system preserves historical information whenever possible.

Examples:

* Project ownership is transferable.
* Original creator never changes.
* Task version history is immutable.
* Session history is preserved.

History should never be rewritten.

---

# 7. Backend Architecture

```
modules/

auth/

users/

projects/

tasks/

reports/

shared/

database/

middleware/

errors/

logger/

types/

utils/
```

Each module contains its own routes, controllers, services, repositories, validators, and related types.

---

# 8. Request Lifecycle

A typical request follows this path:

```
Client

↓

Express Route

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

↓

Repository

↓

Service

↓

Controller

↓

Client
```

Each layer has a clearly defined responsibility.

---

# 9. Security Principles

The system follows these security practices:

* Passwords are never stored in plain text.
* Refresh tokens are stored separately from users.
* Refresh tokens are stored as hashes.
* Authentication and authorization are separated.
* Authorization is enforced at both the application and business layers.
* Sensitive operations require authenticated users.

---

# 10. Scalability Considerations

Although TaskFlow is designed as a monolithic application, the architecture allows future evolution.

Possible future enhancements include:

* Notification Service
* Email Service
* AI Assistant
* Organization/Workspace Support
* External Storage Providers
* Background Job Processing

The current architecture intentionally avoids unnecessary complexity while remaining extensible.

---

# 11. Summary

TaskFlow is designed using modern software engineering principles rather than tutorial-driven implementation.

Key characteristics include:

* Feature-first architecture
* Layered backend design
* Strong separation of concerns
* Business-driven database modeling
* Repository pattern
* JWT authentication with session management
* Soft delete strategy
* Audit-friendly data model
* Scalable project organization

This document serves as the architectural foundation for all implementation decisions throughout the project.
