import { api, unwrap } from './api';

export interface ResumeAnalysis {
  resumeFilename: string;
  professionalSummary: string;
  skills: string[];
  strengths: string[];
  improvementAreas: string[];
  experienceLevel: string;
}
export interface JobMatch {
  jobId: string;
  jobTitle: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  explanation: string;
}
export const analyzeCandidateResume = (resume: File) => {
  const form = new FormData();
  form.append('resume', resume);
  return api.post('/api/candidate/ai/resume/analyze', form).then(unwrap<ResumeAnalysis>);
};
export const getAiJobMatches = () =>
  api.get('/api/candidate/ai/job-matches').then(unwrap<{ matches: JobMatch[] }>);
