import {
  pgTable,
  bigserial,
  bigint,
  text,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const activityLogs = pgTable('activity_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  entity_type: text('entity_type').notNull(),
  entity_id: bigint('entity_id', { mode: 'number' }).notNull(),
  performed_by: bigint('performed_by', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  action: text('action').notNull(),
  old_value: jsonb('old_value'),
  new_value: jsonb('new_value'),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
