import {
  pgTable,
  bigserial,
  bigint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const taskComments = pgTable('task_comments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  task_id: bigint('task_id', { mode: 'number' })
    .notNull()
    .references(() => tasks.id, { onDelete: 'restrict' }),
  user_id: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  comment: text('comment').notNull(),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
