import type { WorkerEvent } from './types.ts';

const MAX_EVENTS = 1000;
const events: WorkerEvent[] = [];

export function append(event: WorkerEvent): void {
  events.push(event);
  if (events.length > MAX_EVENTS) {
    events.shift();
  }
}

export function getAll(): WorkerEvent[] {
  return [...events];
}

export function getByWorkflowId(workflowId: string): WorkerEvent[] {
  return events.filter((e) => e.workflowId === workflowId);
}
