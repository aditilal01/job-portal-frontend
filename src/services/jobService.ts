import { api, unwrap } from './api'; import type { DashboardJob, Job, JobInput, Page } from '../types';
export const getJobs = (params: Record<string, string | number | undefined>) => api.get('/api/jobs', { params }).then(unwrap<Page<Job>>);
export const getJob = (id: string) => api.get(`/api/jobs/${id}`).then(unwrap<Job>);
export const getRecruiterJob = (id: string) => api.get(`/api/recruiter/jobs/${id}`).then(unwrap<Job>);
export const createJob = (input: JobInput) => api.post('/api/jobs', input).then(unwrap<Job>);
export const updateJob = (id: string, input: JobInput) => api.put(`/api/jobs/${id}`, input).then(unwrap<Job>);
export const deleteJob = (id: string) => api.delete(`/api/jobs/${id}`).then(unwrap<void>);
export const recruiterDashboard = () => api.get('/api/recruiter/dashboard').then(unwrap<DashboardJob[]>);
