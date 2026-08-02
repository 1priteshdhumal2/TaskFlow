# Database Design Specification

**Project:** TaskFlow

**Version:** 1.0

**Status:** Draft

**Author:** Pritesh Dhumal

---

# 1. Purpose

This document defines the logical and physical database design for the TaskFlow application.

It serves as the single source of truth for all database-related decisions before implementation begins.

The objective of this document is to ensure that the database accurately models the business domain while remaining maintainable, scalable, secure, and performant.

---

# 2. Scope

This document covers:

- Database design principles
- Naming conventions
- PostgreSQL standards
- Enum definitions
- Entity specifications
- Relationships
- Constraints
- Index strategy
- Delete strategy
- Future improvements

This document intentionally excludes SQL implementation details.

---

# 3. Business Domain

TaskFlow is a collaborative project management platform.

The application enables:

- User authentication
- Project management
- Team collaboration
- Task management
- Multiple task assignees
- Time tracking
- Attachments
- Comments
- Reporting
- Audit logging

---

# 4. Database Design Principles

## 4.1 Business First

The database models business concepts rather than user interface screens.

Every table exists because of a business rule.

---

## 4.2 Third Normal Form (3NF)

The schema should eliminate unnecessary duplication.

Facts are stored once.

Relationships are represented explicitly.

---

## 4.3 Store Facts, Compute Summaries

Derived values are never stored unless performance requirements justify denormalization.

Example:

❌ projects.task_count

Instead:

```sql
SELECT COUNT(*)
FROM tasks
WHERE project_id = ?
```

---

## 4.4 Soft Delete Strategy

Business entities are never permanently removed.

Soft delete is implemented using:

deleted_at

---

## 4.5 Immutable History

Historical information should never be modified.

Examples:

- created_by never changes
- task versions are immutable
- activity logs are append-only

---

## 4.6 Transferable Ownership

Business ownership may change.

Historical authorship never changes.

Example:

owner_id

Current project owner.

created_by

Original creator.

---

## 4.7 Separation of Business and Relationship Tables

Business entities contain a complete lifecycle.

Pure relationship tables remain lightweight.

---

# 5. Naming Standards

## Tables

Plural.

Examples:

users

projects

tasks

---

## Primary Keys

Every table uses

id

---

## Foreign Keys

Format:

<entity>_id

Examples:

user_id

project_id

task_id

owner_id

---

## Audit Columns

Business entities:

created_at

updated_at

deleted_at

Business relationships:

created_at

deleted_at

Pure relationship tables:

No audit fields.

---

# 6. PostgreSQL Standards

## Primary Keys

BIGSERIAL

Reason:

- Small indexes
- Fast joins
- Excellent for monolithic applications
- Easy debugging

---

## Timestamp

TIMESTAMPTZ

Reason:

Timezone-aware timestamps avoid ambiguity and support future internationalization.

---

## Strings

TEXT

Reason:

Avoid arbitrary VARCHAR limits unless business rules require them.

---

## Boolean

BOOLEAN

---

## Numeric

INTEGER

NUMERIC

Depending on the domain.

---

# 7. Enum Definitions

## system_role

Values:

- Admin
- Manager
- Member

Purpose:

Controls application-level authorization.

---

## project_status

Values:

- Draft
- To Be Initiated
- Active
- On Hold
- Archived

Purpose:

Represents the lifecycle of a project.

---

## project_environment

Values:

- Development
- UAT
- Live

Purpose:

Represents the deployment environment.

---

## task_status

Values:

- Todo
- In Progress
- Blocked
- Review
- Done

Purpose:

Represents the current workflow stage of a task.

---

## task_priority

Values:

- Low
- Medium
- High
- Critical

Purpose:

Defines task urgency.

---

# 8. Entity Specifications

Every entity follows the same structure.

- Purpose
- Business Responsibility
- Business Rules
- Relationships
- Columns
- Constraints
- Indexes
- Delete Strategy
- Design Rationale

---

## Users

### Purpose

Represents authenticated users of the system.

### Responsibility

Identity, authentication, and authorization.

### Relationships

- Owns Projects
- Belongs to Projects
- Assigned Tasks
- Creates Tasks
- Writes Comments
- Logs Time
- Has Sessions

### Columns

- id
- first_name
- last_name
- email
- password_hash
- system_role
- phone_number
- profile_image_url
- is_active
- last_login_at
- created_at
- updated_at
- deleted_at

### Constraints

- Primary Key(id)
- Unique(email)

### Indexes

- email
- system_role
- deleted_at

### Delete Strategy

Soft Delete

### Design Rationale

Represents the identity of every authenticated user.

Authentication and profile information remain separate from session information.

---

## User Sessions

### Purpose

Represents authenticated login sessions.

### Responsibility

Refresh token management.

### Business Rules

- Multiple sessions per user
- Refresh tokens stored as hashes
- Sessions expire independently
- Logout revokes one session

### Relationships

Many sessions belong to one user.

### Columns

- id
- user_id
- refresh_token_hash
- device_name
- browser_name
- operating_system
- user_agent
- ip_address
- expires_at
- last_used_at
- revoked_at
- created_at

### Constraints

Foreign Key(user_id)

### Indexes

- user_id
- expires_at
- revoked_at

### Delete Strategy

Hard Delete after expiration cleanup

### Design Rationale

Authentication sessions are separated from user identity to support multiple devices and stronger security.

---

## Projects

### Purpose

Represents business projects.

### Responsibility

Organizing work.

### Business Rules

- One current owner
- Ownership transferable
- Original creator immutable
- Many members
- Many tasks

### Relationships

Projects

↓

Tasks

Projects

↓

Project Members

### Columns

- id
- name
- description
- owner_id
- created_by
- project_status
- project_environment
- planned_start_date
- planned_end_date
- actual_start_date
- actual_end_date
- created_at
- updated_at
- deleted_at

### Constraints

Foreign Keys

owner_id

created_by

### Indexes

- owner_id
- project_status
- project_environment

### Delete Strategy

Soft Delete

### Design Rationale

Projects represent organizational work rather than ownership by an individual.

Ownership may change while authorship remains immutable.

---

(The remaining entities follow the same structure.)

- Project Members
- Tasks
- Task Assignments
- Labels
- Task Labels
- Task Comments
- Task Versions
- Task Attachments
- Time Logs
- Activity Logs

---

# 9. Relationship Matrix

| Parent | Child | Relationship |
|----------|---------------|-------------|
| Users | Projects | 1:N |
| Users | User Sessions | 1:N |
| Users | Project Members | 1:N |
| Projects | Tasks | 1:N |
| Projects | Project Members | 1:N |
| Tasks | Task Assignments | 1:N |
| Tasks | Task Comments | 1:N |
| Tasks | Task Versions | 1:N |
| Tasks | Task Attachments | 1:N |
| Tasks | Time Logs | 1:N |
| Tasks | Activity Logs | 1:N |
| Tasks | Task Labels | 1:N |
| Labels | Task Labels | 1:N |

---

# 10. Constraint Strategy

Business rules should be enforced by the database whenever possible.

Use:

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- CHECK
- NOT NULL

Application validation complements but never replaces database constraints.

---

# 11. Index Strategy

Indexes should be created for:

- Primary Keys
- Foreign Keys
- Unique Keys
- Frequently filtered columns
- Frequently joined columns

Performance optimization beyond this should be driven by query analysis using EXPLAIN ANALYZE.

---

# 12. Delete Strategy

Business Entities

Soft Delete

Relationship Tables

Soft Delete only if relationship history has business value.

Examples:

- project_members
- task_assignments

Pure relationship tables:

Hard Delete

Example:

task_labels

---

# 13. Future Enhancements

Future versions may include:

- Organizations
- Notifications
- Permission Matrix
- AI Assistant
- Calendar Integration
- Webhooks
- Public UUIDs
- Background Jobs

These enhancements are intentionally excluded from Version 1 of the system.