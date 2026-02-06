import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { getDbPool, closeDbPool } from '../client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
// Find .env file in the api directory (go up from src/db/scripts to api root)
const envPath = join(__dirname, '../../../.env');
config({ path: envPath });

/**
 * Get the path to the schemas directory
 */
function getSchemasDirectory(): string {
  return join(__dirname, '../schemas');
}

/**
 * Get all SQL files from the schemas directory, sorted alphabetically
 */
function getSqlFiles(schemasDir: string): string[] {
  if (!existsSync(schemasDir)) {
    throw new Error(`Schemas directory does not exist: ${schemasDir}`);
  }

  const files = readdirSync(schemasDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No SQL files found in ${schemasDir}`);
  }

  return files;
}

/**
 * Read and return the contents of a SQL file
 */
function readSqlFile(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new Error(`SQL file does not exist: ${filePath}`);
  }

  return readFileSync(filePath, 'utf-8');
}

/**
 * Execute SQL file content against the database
 */
async function executeSql(pool: ReturnType<typeof getDbPool>, sql: string, fileName: string): Promise<void> {
  // pg.query handles multiple statements and comments automatically
  const trimmedSql = sql.trim();

  if (!trimmedSql) {
    console.log(`  ⚠️  Skipping ${fileName} - file appears to be empty`);
    return;
  }

  try {
    await pool.query(trimmedSql);
    console.log(`  ✅ Successfully executed ${fileName}`);
  } catch (error) {
    console.error(`  ❌ Error executing ${fileName}:`);
    if (error instanceof Error) {
      console.error(`     ${error.message}`);
      
      // Provide helpful diagnostics for common connection errors
      if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('');
        console.error('  💡 Troubleshooting tips:');
        console.error('     • Check if your Supabase project is active (free tier projects pause after inactivity)');
        console.error('     • Verify the database hostname in your .env file matches your Supabase project');
        console.error('     • Get the correct connection string from: Supabase Dashboard > Settings > Database');
        console.error('     • Ensure your network connection is working');
      } else if (error.message.includes('password authentication failed')) {
        console.error('');
        console.error('  💡 Troubleshooting tips:');
        console.error('     • Verify your database password in the .env file');
        console.error('     • Check your Supabase database password in: Dashboard > Settings > Database');
      } else if (error.message.includes('timeout') || error.message.includes('ECONNREFUSED')) {
        console.error('');
        console.error('  💡 Troubleshooting tips:');
        console.error('     • Check if your Supabase project is paused or inactive');
        console.error('     • Verify the database hostname and port are correct');
        console.error('     • Check your network connection');
      }
    } else {
      console.error(`     ${String(error)}`);
    }
    throw error;
  }
}

/**
 * Main function to run schema migrations
 */
async function runSchemas(specificFile?: string): Promise<void> {
  const schemasDir = getSchemasDirectory();
  let filesToExecute: string[];

  console.log('DATABASE_URL====', process.env.DATABASE_URL);

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    console.error('   Please configure it in your .env file');
    process.exit(1);
  }

  try {
    if (specificFile) {
      // Execute specific file
      const filePath = join(schemasDir, specificFile);
      if (!existsSync(filePath)) {
        console.error(`❌ Error: SQL file does not exist: ${specificFile}`);
        process.exit(1);
      }
      filesToExecute = [specificFile];
    } else {
      // Execute all SQL files
      filesToExecute = getSqlFiles(schemasDir);
    }

    console.log(`📦 Found ${filesToExecute.length} SQL file(s) to execute`);
    console.log('');

    // Initialize database pool
    const pool = getDbPool();
    
    // Test connection before proceeding
    try {
      await pool.query('SELECT 1');
      console.log('🔌 Connected to database');
    } catch (error) {
      console.error('❌ Failed to connect to database');
      if (error instanceof Error) {
        console.error(`   ${error.message}`);
        
        // Provide helpful diagnostics for connection errors
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
          console.error('');
          console.error('💡 Troubleshooting tips:');
          console.error('   • Check if your Supabase project is active (free tier projects pause after inactivity)');
          console.error('   • Verify the database hostname in your .env file matches your Supabase project');
          console.error('   • Get the correct connection string from: Supabase Dashboard > Settings > Database');
          console.error('   • Ensure your network connection is working');
        }
      }
      throw error;
    }
    console.log('');

    // Execute each file in order
    for (const file of filesToExecute) {
      const filePath = join(schemasDir, file);
      console.log(`📄 Executing: ${file}`);
      
      const sql = readSqlFile(filePath);
      await executeSql(pool, sql, file);
    }

    console.log('');
    console.log('✅ All schema files executed successfully');

    // Close database connection
    await closeDbPool();
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed');
    
    // Try to close connection even on error
    try {
      await closeDbPool();
    } catch (closeError) {
      // Ignore close errors
    }

    process.exit(1);
  }
}

// Get command-line argument if provided
const specificFile = process.argv[2];

// Run migrations
runSchemas(specificFile).catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
