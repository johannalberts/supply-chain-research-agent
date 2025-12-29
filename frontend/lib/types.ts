// Types for Supply Chain Intelligence Dashboard

export interface RiskMetric {
  category: string;
  impact_score: number;
  description: string;
}

export interface Source {
  url: string;
  title: string;
}

export interface Report {
  id: number;
  industry: string;
  fragility_score: number;
  executive_summary: string;
  critical_alerts: string[];
  risk_metrics: RiskMetric[];
  sources: Source[];
  created_at: string;
  task_id?: string;
}

export interface TaskStatus {
  task_id: string;
  task_type: string;
  industry: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  duration?: number;
}

export interface ResearchRequest {
  industry: string;
}
