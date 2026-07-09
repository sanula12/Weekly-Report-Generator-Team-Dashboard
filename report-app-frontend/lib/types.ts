export interface User {
  id: string;
  name: string;
  email: string;
  role: 'MEMBER' | 'MANAGER';
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Report {
  id: string;
  user: User;
  project?: Project;
  weekStart: string;
  weekEnd: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers?: string;
  hoursWorked?: number;
  notes?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'LATE';
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Metrics {
  submittedThisWeek: number;
  totalThisWeek: number;
  complianceRate: number;
  openBlockers: number;
}

export interface ReportFormData {
  weekStart: string;
  weekEnd: string;
  projectId: string;
  tasksCompleted: string;
  tasksPlanned: string;
  blockers: string;
  hoursWorked: string;
  notes: string;
}
