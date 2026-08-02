import {
  pgTable,
  bigserial,
  bigint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { projectStatusEnum, projectEnvironmentEnum } from './sharedEnums';

export const projects = pgTable('projects', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  owner_id: bigint('owner_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  created_by: bigint('created_by', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  project_status: projectStatusEnum('project_status')
    .notNull()
    .default('Draft'),
  project_environment: projectEnvironmentEnum('project_environment')
    .notNull()
    .default('Development'),
  planned_start_date: timestamp('planned_start_date', { withTimezone: true }),
  planned_end_date: timestamp('planned_end_date', { withTimezone: true }),
  actual_start_date: timestamp('actual_start_date', { withTimezone: true }),
  actual_end_date: timestamp('actual_end_date', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
