import { type Request, type Response } from 'express';
import { startExampleWorkflow } from '../temporal/client.ts';

export const publishResume = async (req: Request, res: Response) => {
  try {
    const resumeData = req.body;

    // Start the Temporal workflow
    // For the 'example' workflow, we'll use the fullName from resume data or a default
    const name = resumeData.fullName || 'Resume Publisher';
    const { workflowId, runId } = await startExampleWorkflow(name);

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