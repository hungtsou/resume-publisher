import { type Request, type Response } from 'express';
import { createUser } from '../db/schemas/user.ts';
import { createResume } from '../db/schemas/resume.ts';
import { startExampleWorkflow } from '../temporal/client.ts';

export const sendResume = async (req: Request, res: Response) => {
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

    // const user = await createUser({ userName: name });
    
    // Create resume with user ID and resume data
    // const resume = await createResume({
    //   userId: user.id,
    //   fullName: resumeData.fullName,
    //   occupation: resumeData.occupation,
    //   description: resumeData.description,
    //   education: resumeData.education,
    //   experience: resumeData.experience,
    // });
    
    // res.status(200).json({
    //   message: 'Resume created successfully',
    //   resume,
    //   user,
    // });
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({
      error: 'Failed to start resume publishing workflow',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};