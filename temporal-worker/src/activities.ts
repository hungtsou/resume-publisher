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

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function createUser(userName: string): Promise<UserData> {
  const response = await fetch(`${process.env.API_URL}/api/user`, {
    method: 'POST',
    body: JSON.stringify({ userName }),
  });
  return response.json() as Promise<UserData>;
}

export async function createResume(resumeData: CreateResumeInput): Promise<ResumeData> {
  const response = await fetch(`${process.env.API_URL}/api/resume`, {
    method: 'POST',
    body: JSON.stringify(resumeData),
  });
  return response.json() as Promise<ResumeData>;
}
