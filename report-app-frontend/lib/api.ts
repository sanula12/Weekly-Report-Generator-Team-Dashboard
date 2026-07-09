import axios from 'axios';
import Cookies from 'js-cookie';
import type { Report, Project, User, Metrics } from './types';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Reports
export const getMyReports = () => api.get<Report[]>('/reports').then(r => r.data);
export const createReport = (data: object) => api.post<Report>('/reports', data).then(r => r.data);
export const updateReport = (id: string, data: object) => api.put<Report>(`/reports/${id}`, data).then(r => r.data);
export const submitReport = (id: string) => api.patch<Report>(`/reports/${id}/submit`).then(r => r.data);
export const deleteReport = (id: string) => api.delete(`/reports/${id}`);
export const getReportById = (id: string) => api.get<Report>(`/reports/${id}`).then(r => r.data);

// Projects
export const getProjects = () => api.get<Project[]>('/projects').then(r => r.data);
export const createProject = (data: { name: string; description?: string }) => api.post<Project>('/projects', data).then(r => r.data);
export const updateProject = (id: string, data: { name: string; description?: string }) => api.put<Project>(`/projects/${id}`, data).then(r => r.data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Dashboard (Manager)
export const getDashboardReports = (params?: { userId?: string; projectId?: string; weekStart?: string; weekEnd?: string }) =>
  api.get<Report[]>('/dashboard/reports', { params }).then(r => r.data);
export const getDashboardMetrics = () => api.get<Metrics>('/dashboard/metrics').then(r => r.data);
export const getDashboardUsers = () => api.get<User[]>('/dashboard/users').then(r => r.data);
export const getDashboardActivity = (limit?: number) => api.get<Report[]>('/dashboard/activity', { params: { limit } }).then(r => r.data);

// AI Chat
export const sendChatMessage = (message: string) => api.post<{ response: string }>('/ai/chat', { message }).then(r => r.data);

export default api;