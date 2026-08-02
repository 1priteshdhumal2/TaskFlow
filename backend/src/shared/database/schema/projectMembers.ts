import {
  pgTable,
  bigserial,
  bigint,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';
import { projectRoleEnum } from './sharedEnums';

export const projectMembers = pgTable(
  'project_members',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    project_id: bigint('project_id', { mode: 'number' })
      .notNull()
      .references(() => projects.id, { onDelete: 'restrict' }),
    user_id: bigint('user_id', { mode: 'number' })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    role_in_project: projectRoleEnum('role_in_project')
      .notNull()
      .default('Developer'),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    uqProjectUser: unique('uq_project_members_project_user').on(
      t.project_id,
      t.user_id
    ),
  })
);
