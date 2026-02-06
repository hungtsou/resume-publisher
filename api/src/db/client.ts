import { Pool } from 'pg';

// Singleton pattern for database connection pool
let dbPool: Pool | null = null;

/**
 * Initialize and return the database connection pool
 * This should be called once when the API starts
 */
export function getDbPool(): Pool {
  if (dbPool) {
    return dbPool;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please configure it in your .env file.'
    );
  }

  dbPool = new Pool({
    connectionString: databaseUrl,
    // Connection pool configuration
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
  });

  // Handle pool errors
  dbPool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
  });

  return dbPool;
}

/**
 * Close the database connection pool (call on shutdown)
 */
export async function closeDbPool(): Promise<void> {
  if (dbPool) {
    await dbPool.end();
    dbPool = null;
    console.log('Database connection pool closed');
  }
}
