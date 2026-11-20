import { api, unwrap } from './api';
import type { SavedJob } from '../types';

export const getSavedJobs = () => api.get('/api/candidate/saved-jobs').then(unwrap<SavedJob[]>);
export const saveJob = (jobId: string) => api.post(`/api/candidate/saved-jobs/${jobId}`).then(unwrap<SavedJob>);
export const removeSavedJob = (jobId: string) => api.delete(`/api/candidate/saved-jobs/${jobId}`).then(unwrap<void>);