export interface WorkerEvent {
  workflowId: string;
  runId: string;
  event: string;
  step: string;
  message: string;
  timestamp: string;
}
