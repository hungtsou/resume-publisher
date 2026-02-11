import { type Request, type Response } from 'express';
import * as workerEvents from '../worker-events/index.ts';

export const getWorkerEvents = async (req: Request, res: Response) => {
  const { workflowId, debug } = req.query;
  if (debug === '1' || debug === 'true') {
    const stats = workerEvents.getStoreStats();
    return res.json({ debug: true, ...stats });
  }
  if (typeof workflowId === 'string' && workflowId) {
    const events = workerEvents.getByWorkflowId(workflowId);
    return res.json({ events });
  }
  const events = workerEvents.getAll();
  res.json({ events });
};

export const postWorkerEvent = async (req: Request, res: Response) => {
  const body = req.body as { workflowId?: string; runId?: string; event?: string; step?: string; message?: string; timestamp?: string };
  if (!body || typeof body.workflowId !== 'string') {
    return res.status(400).json({ error: 'Missing workflowId' });
  }
  workerEvents.append({
    workflowId: body.workflowId ?? '',
    runId: body.runId ?? '',
    event: body.event ?? '',
    step: body.step ?? '',
    message: body.message ?? '',
    timestamp: body.timestamp ?? new Date().toISOString(),
  });
  res.status(202).send();
};
