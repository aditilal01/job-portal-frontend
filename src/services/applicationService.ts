import { api, unwrap } from './api'; import type { Application, ApplicationStatus } from '../types';
export const applyToJob = (jobId: string, resume?: File) => { const form = new FormData(); form.append('jobId', jobId); if (resume) form.append('resume', resume); return api.post('/api/applications', form).then(unwrap<Application>); };
export const myApplications = () => api.get('/api/applications/my').then(unwrap<Application[]>);
export const jobApplications = (jobId: string) => api.get(`/api/applications/job/${jobId}`).then(unwrap<Application[]>);
export const updateStatus = (id: string, status: ApplicationStatus) => api.patch(`/api/applications/${id}/status`, { status }).then(unwrap<Application>);
export const downloadResume = async (resumeUrl: string) => {
  const response = await api.get(resumeUrl, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data); const link = document.createElement('a'); link.href = url; link.download = 'resume'; link.click(); URL.revokeObjectURL(url);
};
