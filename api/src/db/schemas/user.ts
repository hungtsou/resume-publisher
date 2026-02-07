import { getDbPool } from '../client.ts';

/**
 * User schema types
 * 
 * These types represent the user entity in the database and application.
 * Note: Database columns use snake_case (user_name), while TypeScript uses camelCase (userName).
 */

/**
 * User entity as it appears in the application
 */
export interface User {
  id: string; // UUID as string
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new user
 */
export interface CreateUserInput {
  userName: string;
}

/**
 * User row as returned from database queries
 * This matches the actual database column names (snake_case)
 */
export interface UserRow {
  id: string;
  user_name: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Helper function to map database row to application User type
 */
export function mapUserRowToUser(row: UserRow): User {
  return {
    id: row.id,
    userName: row.user_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Create a new user in the database
 * @param input - User creation input containing userName
 * @returns The created User object
 * @throws Error if userName already exists or database operation fails
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const pool = getDbPool();

  const query = `
    INSERT INTO users (user_name)
    VALUES ($1)
    RETURNING id, user_name, created_at, updated_at
  `;

  try {
    const result = await pool.query<UserRow>(query, [input.userName]);
    
    if (result.rows.length === 0) {
      throw new Error('Failed to create user: no rows returned');
    }

    return mapUserRowToUser(result.rows[0]);
  } catch (error) {
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('duplicate key')) {
      throw new Error(`User with name "${input.userName}" already exists`);
    }
    throw error;
  }
}
