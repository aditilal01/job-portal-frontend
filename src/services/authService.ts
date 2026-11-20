import { api, unwrap } from './api'; import type { AuthUser } from '../types';
export const login = (email: string, password: string) => api.post('/api/auth/login', { email, password }).then(unwrap<AuthUser>);
export const register = (name: string, email: string, password: string, role: 'CANDIDATE' | 'RECRUITER') => api.post('/api/auth/register', { name, email, password, role }).then(unwrap<AuthUser>);
