// Types for the TEA Assessment System

export interface Question {
  id: string;
  groupName: string;
  question: string;
  observations: string;
  observedResponse?: ResponseType;
  parentResponse?: ResponseType;
  professionalResponse?: ResponseType;
  finalResponse?: ResponseType;
}

export type ResponseType = 'A' | 'P' | 'N' | 'X';

export interface FormData {
  id: string;
  name: string;
  createdAt: string;
  questions: Question[];
  status: 'draft' | 'published' | 'completed';
}

export interface FormResponse {
  id: string;
  formId: string;
  formName: string;
  respondentName: string;
  submittedAt: string;
  responses: Record<string, ResponseType>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'professional' | 'parent';
  createdAt: string;
}

export interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  activeUsers: number;
  completionRate: number;
}