import {
  pgTable,
  bigserial,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { systemRoleEnum } from './sharedEnums';

export const users = pgTable('users', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  system_role: systemRoleEnum('system_role').notNull().default('Member'),
  phone_number: text('phone_number'),
  profile_image_url: text('profile_image_url'),
  is_active: boolean('is_active').notNull().default(true),
  last_login_at: timestamp('last_login_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp('deleted_at', { withTimezone: true }),
});
