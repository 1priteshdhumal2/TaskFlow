import {
  pgTable,
  bigserial,
  bigint,
  integer,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';
import { taskStatusEnum, taskPriorityEnum } from './sharedEnums';

export const taskVersions = pgTable(
  'task_versions',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    task_id: bigint('task_id', { mode: 'number' })
      .notNull()
      .references(() => tasks.id, { onDelete: 'restrict' }),
    version_number: integer('version_number').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    task_status: taskStatusEnum('task_status').notNull(),
    task_priority: taskPriorityEnum('task_priority').notNull(),
    changed_by: bigint('changed_by', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uqTaskVersion: unique('uq_task_versions_task_version').on(
      t.task_id,
      t.version_number
    ),
  })
);
