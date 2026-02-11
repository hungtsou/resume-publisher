import { type Request, type Response } from 'express';
import * as workerEvents from '../worker-events/index.ts';

export const getWorkerEvents = async (req: Request, res: Response) => {
  const { workflowId } = req.query;
  if (typeof workflowId === 'string' && workflowId) {
    const events = workerEvents.getByWorkflowId(workflowId);
    return res.json({ events });
  }
  const events = workerEvents.getAll();
  res.json({ events });
};
