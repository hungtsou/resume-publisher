import { Connection, Client } from '@temporalio/client';
import { nanoid } from 'nanoid';
import type { CreateResumeInput } from '../db/schemas/resume.ts';

// Singleton pattern for Temporal client
let temporalClient: Client | null = null;

/**
 * Initialize and return the Temporal client
 * This should be called once when the API starts
 */
export async function getTemporalClient(): Promise<Client> {
  if (temporalClient) {
    return temporalClient;
  }

  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS || 'localhost:7233',
    // Add TLS configuration if needed
    // tls: { ... }
  });

  temporalClient = new Client({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE || 'default',
  });

  return temporalClient;
}

/**
 * Generic function to start any workflow by name
 */
export async function startWorkflow(
  workflowName: string,
  args: unknown[],
  options?: {
    workflowId?: string;
    taskQueue?: string;
  }
): Promise<{ workflowId: string; runId: string }> {
  const client = await getTemporalClient();

  const workflowId = options?.workflowId || `${workflowName}-${nanoid()}`;
  const taskQueue = options?.taskQueue || process.env.TEMPORAL_TASK_QUEUE || 'hello-world-test';

  const handle = await client.workflow.start(workflowName, {
    taskQueue,
    workflowId,
    args,
    memo: {
      workflowArgs: JSON.stringify(args),
      argCount: args.length.toString(),
    },
  });

  return {
    workflowId: handle.workflowId,
    runId: handle.firstExecutionRunId,
  };
}

/**
 * Start the 'example' workflow
 * This is a specific function for the existing example workflow
 */
export async function startExampleWorkflow(
  name: string
): Promise<{ workflowId: string; runId: string }> {
  return startWorkflow('example', [name], {
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'hello-world-test',
  });
}

/**
 * Get workflow result (optional - for synchronous workflows)
 */
export async function getWorkflowResult<T>(
  workflowId: string
): Promise<T> {
  const client = await getTemporalClient();
  const handle = client.workflow.getHandle(workflowId);
  return handle.result();
}

/**
 * Close the Temporal connection (call on shutdown)
 */
export async function closeTemporalClient(): Promise<void> {
  if (temporalClient) {
    await temporalClient.connection.close();
    temporalClient = null;
  }
}


export async function startPublishResumeWorkflow(resumeData: CreateResumeInput): Promise<{ workflowId: string; runId: string }> {
  return startWorkflow('publishResume', [resumeData], {
    taskQueue: process.env.TEMPORAL_TASK_QUEUE || 'hello-world-test',
  });
}