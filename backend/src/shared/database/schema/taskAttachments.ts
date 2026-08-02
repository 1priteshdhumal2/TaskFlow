import {
  pgTable,
  bigserial,
  bigint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { tasks } from './tasks';
import { users } from './users';

export const taskAttachments = pgTable('task_attachments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  task_id: bigint('task_id', { mode: 'number' })
    .notNull()
    .references(() => tasks.id, { onDelete: 'restrict' }),
  file_name: text('file_name').notNull(),
  file_path: text('file_path').notNull(),
  file_size: bigint('file_size', { mode: 'number' }),
  mime_type: text('mime_type'),
  uploaded_by: bigint('uploaded_by', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
