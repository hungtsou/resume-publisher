import { type Request, type Response } from 'express';
import { createResume, getResumeById, getAllResumes } from '../db/schemas/resume.ts';

export const createResumeController = async (req: Request, res: Response) => {
  try {
    const resumeData = req.body;

    // Create resume with user ID and resume data
    const resume = await createResume({
      userId: resumeData.userid,
      fullName: resumeData.fullName,
      occupation: resumeData.occupation,
      description: resumeData.description,
      education: resumeData.education,
      experience: resumeData.experience,
    });
    
    res.status(200).json({
      message: 'Resume created successfully',
      resume,
    });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({
      error: 'Failed to create resume',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getResumeController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const resume = await getResumeById(id);
  res.status(200).json({ resume });
};

export const getResumesController = async (req: Request, res: Response) => {
  const resumes = await getAllResumes();
  res.status(200).json({ resumes });
};