import { Request, Response } from 'express';
import { startExampleWorkflow } from '../temporal/client';
import { createUser } from '../db/schemas/user';

export const sendResume = async (req: Request, res: Response) => {
  try {
    const resumeData = req.body;

    // Start the Temporal workflow
    // For the 'example' workflow, we'll use the fullName from resume data or a default
    const name = resumeData.fullName || 'Resume Publisher';
    // const { workflowId, runId } = await startExampleWorkflow(name);

    // // Return 202 Accepted for async processing
    // res.status(202).json({
    //   message: 'Resume publishing workflow started',
    //   workflowId,
    //   runId,
    //   status: 'processing',
    //   // Optional: provide a URL to check status
    //   statusUrl: `/api/resume/status/${workflowId}`,
    // });

    const user = await createUser({ userName: name });
    res.status(200).json({
      message: 'User created',
      user,
    });
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({
      error: 'Failed to start resume publishing workflow',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};