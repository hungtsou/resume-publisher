export interface CreateResumeInput {
  userId: string;
  fullName: string;
  occupation?: string;
  description?: string;
  education?: any[];
  experience?: any[];
}

export interface ResumeData {
  id: string; // UUID as string
  userId: string; // UUID as string
  fullName: string;
  occupation: string | null;
  description: string | null;
  education: any[];
  experience: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string; // UUID as string
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function createUser(userName: string): Promise<UserData> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`createUser fetch failed: ${message}`);
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`createUser failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }
  const responseData = (await response.json()) as { user: UserData };
  return responseData.user;
}

export async function createResume(resumeData: CreateResumeInput): Promise<ResumeData> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`createResume fetch failed: ${message}`);
  }
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`createResume failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }
  return response.json() as Promise<ResumeData>;
}
