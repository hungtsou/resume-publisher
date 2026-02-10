import { type Request, type Response } from 'express';
import { startPublishResumeWorkflow } from '../temporal/client.ts';
import type { CreateResumeInput } from '../db/schemas/resume.ts';

export const publishResume = async (req: Request, res: Response) => {
  try {
    const resumeData = req.body as CreateResumeInput;

    // Start the Temporal workflow
    const { workflowId, runId } = await startPublishResumeWorkflow(resumeData);

    // Return 202 Accepted for async processing
    res.status(202).json({
      message: 'Resume publishing workflow started',
      workflowId,
      runId,
      status: 'processing',
      // Optional: provide a URL to check status
      statusUrl: `/api/resume/status/${workflowId}`,
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({
      error: 'Failed to start resume publishing workflow',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};