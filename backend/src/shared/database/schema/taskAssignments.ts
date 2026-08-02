import {
  pgTable,
  bigserial,
  bigint,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const taskAssignments = pgTable(
  'task_assignments',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    task_id: bigint('task_id', { mode: 'number' })
      .notNull()
      .references(() => tasks.id, { onDelete: 'restrict' }),
    user_id: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    assigned_by: bigint('assigned_by', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    uqTaskUser: unique('uq_task_assignments_task_user').on(
      t.task_id,
      t.user_id
    ),
  })
);
