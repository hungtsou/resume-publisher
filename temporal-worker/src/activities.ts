import { Context } from '@temporalio/activity';
import { publishEvent } from './event-publisher/index';

export interface CreateResumeInput {
  userId: string;
  fullName: string;
  occupation?: string;
  description?: string;
  published?: boolean;
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

function getWorkflowIds(): { workflowId: string; runId: string } {
  const info = Context.current().info;
  return {
    workflowId: info.workflowExecution.workflowId,
    runId: info.workflowExecution.runId,
  };
}

async function emit(event: string, step: string, message: string): Promise<void> {
  const { workflowId, runId } = getWorkflowIds();
  try {
    await publishEvent({
      workflowId,
      runId,
      event,
      step,
      message,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    // Non-fatal: do not fail the activity if Kafka is unavailable
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('Event publisher send failed:', msg, err);
  }
}

export async function greet(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

export async function createUser(userName: string): Promise<UserData> {
  await emit('activity_started', 'createUser', `Creating user: ${userName}`);
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await emit('activity_failed', 'createUser', `createUser fetch failed: ${message}`);
    throw new Error(`createUser fetch failed: ${message}`);
  }
  if (!response.ok) {
    const body = await response.text();
    await emit('activity_failed', 'createUser', `createUser failed: ${response.status} ${response.statusText}`);
    throw new Error(`createUser failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }
  const responseData = (await response.json()) as { user: UserData };
  await emit('activity_completed', 'createUser', `User created: ${responseData.user.id}`);
  return responseData.user;
}

export async function createResume(resumeData: CreateResumeInput): Promise<ResumeData> {
  await emit('activity_started', 'createResume', 'Creating resume');
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await emit('activity_failed', 'createResume', `createResume fetch failed: ${message}`);
    throw new Error(`createResume fetch failed: ${message}`);
  }
  if (!response.ok) {
    const body = await response.text();
    await emit('activity_failed', 'createResume', `createResume failed: ${response.status} ${response.statusText}`);
    throw new Error(`createResume failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }
  const { resume } = (await response.json()) as { resume: ResumeData };
  await emit('activity_completed', 'createResume', `Resume created: ${resume.id}`);
  return resume;
}

export async function updateResume(id: string, resumeData: CreateResumeInput): Promise<ResumeData> {
  await emit('activity_started', 'updateResume', 'Updating resume');
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/resume/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resumeData),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await emit('activity_failed', 'updateResume', `updateResume fetch failed: ${message}`);
    throw new Error(`updateResume fetch failed: ${message}`);
  }
  if (!response.ok) {
    const body = await response.text();
    await emit('activity_failed', 'updateResume', `updateResume failed: ${response.status} ${response.statusText}`);
    throw new Error(`updateResume failed: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
  }
  const { resume } = (await response.json()) as { resume: ResumeData };
  await emit('activity_completed', 'updateResume', `Resume updated: ${resume.id}`);
  return resume;
}
