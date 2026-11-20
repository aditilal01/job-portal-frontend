import axios from 'axios';
import type { ApiResponse } from '../types';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080', headers: { Accept: 'application/json' } });
api.interceptors.request.use((config) => { const token = localStorage.getItem('jobPortalToken'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((response) => response, (error) => { if (error.response?.status === 401) window.dispatchEvent(new Event('auth:expired')); return Promise.reject(error); });
export const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;
export const errorMessage = (error: unknown) => axios.isAxiosError(error) ? error.response?.data?.message || 'The request could not be completed.' : 'Something went wrong.';
