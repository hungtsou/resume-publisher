export interface WorkerEventPayload {
  workflowId: string;
  runId: string;
  event: string;
  step: string;
  message: string;
  timestamp: string;
}
