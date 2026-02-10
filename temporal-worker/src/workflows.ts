import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import * as activities from './activities';

const { greet, createUser, createResume } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
export async function example(name: string, lastName: string): Promise<string> {
  return await greet(`${name} ${lastName}`);
}

export async function publishResume(resumeData: activities.CreateResumeInput) {
  const user = await createUser(resumeData.fullName);
  const resume = await createResume({
    userId: user.id,
    fullName: resumeData.fullName,
    occupation: resumeData.occupation,
    description: resumeData.description,
    education: resumeData.education,
    experience: resumeData.experience,
  });
  return resume;
}
