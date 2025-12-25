// API utilities for Supply Chain Intelligence Dashboard

import { Report, TaskStatus, ResearchRequest } from './types';
import { getAuthToken } from './auth-context';

// Use the backend URL directly
const API_BASE_URL = typeof window !== 'undefined'
  ? 'http://localhost:8000' // Client-side: call backend directly
  : process.env.API_URL || 'http://backend:8000'; // Server-side: use Docker network

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token and add to headers
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(`Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Research API endpoints
export const api = {
  // Submit a new research request
  submitResearch: (data: ResearchRequest): Promise<TaskStatus> => 
    fetchApi('/api/supply-chain/research/requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get task status
  getTaskStatus: (taskId: string): Promise<TaskStatus> =>
    fetchApi(`/api/supply-chain/research/requests/${taskId}/status`),

  // Get completed report
  getTaskReport: (taskId: string): Promise<Report> =>
    fetchApi(`/api/supply-chain/research/requests/${taskId}/report`),

  // List all tasks with optional filtering
  listTasks: (params?: { status?: string; limit?: number }): Promise<TaskStatus[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return fetchApi(`/api/supply-chain/research/requests/${query ? `?${query}` : ''}`);
  },

  // Cancel a task
  cancelTask: (taskId: string, reason?: string): Promise<{ message: string; task_id: string }> =>
    fetchApi(`/api/supply-chain/research/requests/${taskId}/`, {
      method: 'DELETE',
      body: reason ? JSON.stringify({ reason }) : undefined,
    }),

  // Trigger scheduled research
  triggerScheduledResearch: (): Promise<{ message: string; task_id: string }> =>
    fetchApi('/api/supply-chain/research/scheduled/run/', { method: 'POST' }),
};
