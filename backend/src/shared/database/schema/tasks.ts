import {
  pgTable,
  bigserial,
  bigint,
  text,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';
import { taskStatusEnum, taskPriorityEnum } from './sharedEnums';

export const tasks = pgTable('tasks', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  project_id: bigint('project_id', { mode: 'number' })
    .notNull()
    .references(() => projects.id, { onDelete: 'restrict' }),
  title: text('title').notNull(),
  description: text('description'),
  task_status: taskStatusEnum('task_status').notNull().default('Todo'),
  task_priority: taskPriorityEnum('task_priority').notNull().default('Medium'),
  created_by: bigint('created_by', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  due_date: timestamp('due_date', { withTimezone: true }),
  estimated_hours: numeric('estimated_hours', { precision: 6, scale: 2 }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
