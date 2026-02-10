import { getDbPool } from '../client.ts';

/**
 * Resume schema types
 * 
 * These types represent the resume entity in the database and application.
 * Note: Database columns use snake_case (user_id, full_name), while TypeScript uses camelCase (userId, fullName).
 */

/**
 * Education entry type matching the UI interface
 */
export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
}

/**
 * Experience entry type matching the UI interface
 */
export interface ExperienceEntry {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
}

/**
 * Resume entity as it appears in the application
 */
export interface Resume {
  id: string; // UUID as string
  userId: string; // UUID as string
  fullName: string;
  occupation: string | null;
  description: string | null;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input type for creating a new resume
 */
export interface CreateResumeInput {
  userId: string;
  fullName: string;
  occupation?: string;
  description?: string;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
}

/**
 * Resume row as returned from database queries
 * This matches the actual database column names (snake_case)
 */
export interface ResumeRow {
  id: string;
  user_id: string;
  full_name: string;
  occupation: string | null;
  description: string | null;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  created_at: Date;
  updated_at: Date;
}

/**
 * Helper function to map database row to application Resume type
 */
export function mapResumeRowToResume(row: ResumeRow): Resume {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    occupation: row.occupation,
    description: row.description,
    education: row.education,
    experience: row.experience,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Create a new resume in the database
 * @param input - Resume creation input containing userId, fullName, and optional fields
 * @returns The created Resume object
 * @throws Error if user_id doesn't exist or database operation fails
 */
export async function createResume(input: CreateResumeInput): Promise<Resume> {
  const pool = getDbPool();

  const query = `
    INSERT INTO resumes (user_id, full_name, occupation, description, education, experience)
    VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb)
    RETURNING id, user_id, full_name, occupation, description, education, experience, created_at, updated_at
  `;

  try {
    const result = await pool.query<ResumeRow>(query, [
      input.userId,
      input.fullName,
      input.occupation || null,
      input.description || null,
      JSON.stringify(input.education || []),
      JSON.stringify(input.experience || []),
    ]);
    
    if (result.rows.length === 0) {
      throw new Error('Failed to create resume: no rows returned');
    }

    return mapResumeRowToResume(result.rows[0]);
  } catch (error) {
    // Handle foreign key constraint violation
    if (error instanceof Error && error.message.includes('foreign key')) {
      throw new Error(`User with id "${input.userId}" does not exist`);
    }
    throw error;
  }
}

export async function getResumeById(id: string): Promise<Resume> {
  const pool = getDbPool();

  const query = `SELECT id, user_id, full_name, occupation, description, education, experience, created_at, updated_at FROM resumes WHERE id = $1`;
  const result = await pool.query<ResumeRow>(query, [id]);
  return mapResumeRowToResume(result.rows[0]);
}

export async function getAllResumes(): Promise<Resume[]> {
  const pool = getDbPool();
  const query = `SELECT id, user_id, full_name, occupation, description, education, experience, created_at, updated_at FROM resumes`;
  const result = await pool.query<ResumeRow>(query);
  return result.rows.map(mapResumeRowToResume);
}