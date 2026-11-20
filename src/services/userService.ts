import { api, unwrap } from './api'; import type { AdminStats, User } from '../types';
export const getUsers = () => api.get('/api/users').then(unwrap<User[]>);
export const getUser = (id: string) => api.get(`/api/users/${id}`).then(unwrap<User>);
export const getAdminStats = () => api.get('/api/admin/stats').then(unwrap<AdminStats>);
