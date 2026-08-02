import { eq, and, isNull, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { db as defaultDb } from '../../../shared/database/db';
import { users } from '../../../shared/database/schema/users';
import * as schema from '../../../shared/database/schema';
import { User, NewUser, UpdateUser } from '../types/user.types';

export class UserRepository {
  constructor(
    private readonly dbInstance: NodePgDatabase<typeof schema> = defaultDb
  ) {}

  /**
   * Find an active (non-soft-deleted) user by primary key ID.
   */
  async findById(id: number): Promise<User | null> {
    const result = await this.dbInstance
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Find an active user by unique email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.dbInstance
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deleted_at)))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Insert a new user record and return the created entity.
   */
  async create(user: NewUser): Promise<User> {
    const result = await this.dbInstance
      .insert(users)
      .values(user)
      .returning();

    return result[0];
  }

  /**
   * Update fields for an existing active user record.
   */
  async update(id: number, updates: UpdateUser): Promise<User | null> {
    const result = await this.dbInstance
      .update(users)
      .set({
        ...updates,
        updated_at: new Date(),
      })
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .returning();

    return result[0] ?? null;
  }

  /**
   * Soft delete a user record by setting deleted_at timestamp.
   */
  async softDelete(id: number): Promise<boolean> {
    const result = await this.dbInstance
      .update(users)
      .set({
        deleted_at: new Date(),
        updated_at: new Date(),
      })
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .returning();

    return result.length > 0;
  }

  /**
   * Update the last_login_at timestamp for a user.
   */
  async updateLastLogin(id: number): Promise<User | null> {
    const result = await this.dbInstance
      .update(users)
      .set({
        last_login_at: new Date(),
        updated_at: new Date(),
      })
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .returning();

    return result[0] ?? null;
  }

  /**
   * Check if an active user exists with the given email address.
   */
  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.dbInstance
      .select({ val: count() })
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deleted_at)));

    return Number(result[0]?.val ?? 0) > 0;
  }
}

export const userRepository = new UserRepository();
