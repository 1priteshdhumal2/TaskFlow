import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from '../../../shared/database/schema/users';

/**
 * Full User record as stored in PostgreSQL
 */
export type User = InferSelectModel<typeof users>;

/**
 * Payload required to insert a new User record
 */
export type NewUser = InferInsertModel<typeof users>;

/**
 * Updatable fields for an existing User record
 */
export type UpdateUser = Partial<
  Omit<NewUser, 'id' | 'created_at' | 'deleted_at'>
>;
