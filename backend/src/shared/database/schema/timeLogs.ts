import {
  pgTable,
  bigserial,
  bigint,
  numeric,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const timeLogs = pgTable('time_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  task_id: bigint('task_id', { mode: 'number' })
    .notNull()
    .references(() => tasks.id, { onDelete: 'restrict' }),
  user_id: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  hours_spent: numeric('hours_spent', { precision: 5, scale: 2 }).notNull(),
  log_date: timestamp('log_date', { withTimezone: true })
    .notNull()
    .defaultNow(),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
