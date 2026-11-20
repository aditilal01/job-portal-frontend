export type Role = 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
export interface ApiResponse<T> { success: boolean; message: string; data: T; timestamp?: string }
export interface AuthUser { token: string; tokenType: string; userId: string; name: string; role: Role }
export interface Job { id: string; title: string; description: string; requiredSkills: string; location: string; experienceRequired: number; salaryRange?: string; recruiterName: string; recruiterId: string; isActive: boolean; createdAt: string }
export interface Page<T> { content: T[]; totalPages: number; totalElements: number; number: number; size: number; last: boolean }
export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'HIRED';
export interface Application { id: string; jobId: string; jobTitle: string; candidateId: string; candidateName: string; candidateEmail: string; candidateProfile?: CandidateProfileSummary; resumeUrl?: string; status: ApplicationStatus; appliedAt: string; updatedAt?: string }
export interface DashboardJob { jobId: string; jobTitle: string; location: string; isActive: boolean; applicantCount: number; createdAt: string }
export interface User { id: string; name: string; email: string; role: Role; createdAt: string }
export interface JobInput { title: string; description: string; requiredSkills: string; location: string; experienceRequired: number; salaryRange?: string }
export interface CandidateProfile {
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  headline?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string;
  education?: string;
  experience?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  updatedAt?: string;
  profileVisibleToRecruiters?: boolean;
}
export interface CandidateProfileSummary {
  headline?: string;
  location?: string;
  summary?: string;
  skills?: string;
  education?: string;
  experience?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
  githubUrl?: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  title: string;
  description: string;
  requiredSkills: string;
  location: string;
  experienceRequired: number;
  salaryRange?: string;
  recruiterName: string;
  isActive: boolean;
  jobPostedAt: string;
  savedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  candidates: number;
  recruiters: number;
  admins: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
}
