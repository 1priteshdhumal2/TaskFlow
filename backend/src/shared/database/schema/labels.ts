import {
  pgTable,
  bigserial,
  bigint,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const labels = pgTable(
  'labels',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    color_hex: text('color_hex'),
    project_id: bigint('project_id', { mode: 'number' }).references(
      () => projects.id,
      { onDelete: 'restrict' }
    ),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    deleted_at: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    uqProjectName: unique('uq_labels_project_name').on(t.project_id, t.name),
  })
);
