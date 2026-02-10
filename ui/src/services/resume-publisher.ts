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