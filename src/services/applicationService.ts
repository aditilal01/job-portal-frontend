import { api, unwrap } from './api'; import type { Application, ApplicationStatus } from '../types';
export const applyToJob = (jobId: string, resume?: File) => { const form = new FormData(); form.append('jobId', jobId); if (resume) form.append('resume', resume); return api.post('/api/applications', form).then(unwrap<Application>); };
export const myApplications = () => api.get('/api/applications/my').then(unwrap<Application[]>);
export const jobApplications = (jobId: string) => api.get(`/api/applications/job/${jobId}`).then(unwrap<Application[]>);
export const updateStatus = (id: string, status: ApplicationStatus) => api.patch(`/api/applications/${id}/status`, { status }).then(unwrap<Application>);

const getResumeFilename = (contentDisposition: string | undefined, contentType: string | undefined) => {
  const encoded = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const quoted = contentDisposition?.match(/filename="([^"]+)"/i)?.[1];
  const plain = contentDisposition?.match(/filename=([^;]+)/i)?.[1];
  const supplied = encoded ? decodeURIComponent(encoded) : quoted || plain;
  if (supplied) return supplied.trim().replace(/^["']|["']$/g, '');

  const mime = contentType?.toLowerCase() || '';
  if (mime.includes('pdf')) return 'resume.pdf';
  if (mime.includes('wordprocessingml')) return 'resume.docx';
  if (mime.includes('msword')) return 'resume.doc';
  return 'resume';
};

export const downloadResume = async (resumeUrl: string) => {
  const response = await api.get(resumeUrl, { responseType: 'blob' });
  const filename = getResumeFilename(
    response.headers['content-disposition'],
    response.headers['content-type'] || response.data.type,
  );
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
