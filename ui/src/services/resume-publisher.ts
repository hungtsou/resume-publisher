import { ResumeFormData } from "../components/resume-form/types";

export const sendResume = async (resume: ResumeFormData) => {
  const response = await fetch('/api/resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resume),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send resume: ${response.statusText}`);
  }
  
  return response.json();
};

export const check = async () => {
  const response = await fetch('/api/check', {
    method: 'GET',
  });
  return response.json();
};

export const publishResume = async (resume: ResumeFormData) => {
  const response = await fetch('/api/publish-resume', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resume),
  });
  if (!response.ok) {
    throw new Error(`Failed to publish resume: ${response.statusText}`);
  }
  return response.json();
};

export const getResumes = async () => {
  const response = await fetch('/api/resume', {
    method: 'GET',
  });
  return response.json();
};

export const getResumeById = async (id: string) => {
  const response = await fetch(`/api/resume/${id}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error('Resume not found');
    throw new Error(`Failed to fetch resume: ${response.statusText}`);
  }
  const { resume } = await response.json();
  return resume;
};