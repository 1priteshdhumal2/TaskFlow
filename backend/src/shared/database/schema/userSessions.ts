import {
  pgTable,
  bigserial,
  bigint,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const userSessions = pgTable('user_sessions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  user_id: bigint('user_id', { mode: 'number' })
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  refresh_token_hash: text('refresh_token_hash').notNull(),
  device_name: text('device_name'),
  browser_name: text('browser_name'),
  operating_system: text('operating_system'),
  user_agent: text('user_agent'),
  ip_address: text('ip_address'),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  last_used_at: timestamp('last_used_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  revoked_at: timestamp('revoked_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
