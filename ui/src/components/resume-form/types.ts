export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
}

export interface ExperienceEntry {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
}

export interface ResumeFormData {
  fullName: string;
  occupation: string;
  description: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
}
