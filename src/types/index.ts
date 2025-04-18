export interface ChecklistSubmission {
  id?: string;
  employee_name: string;
  employee_id: string;
  department: string;
  start_date: string;
  submission_date: string;
  signature: string;
  signature_date: string;
  status: 'complete' | 'incomplete' | 'pending';
  completion_percentage: number;
  comments?: string;
  responses?: {
    company_handbook?: boolean;
    team_introduction?: boolean;
    orientation_session?: boolean;
    tax_forms?: boolean;
    benefits_enrollment?: boolean;
    direct_deposit?: boolean;
    equipment_received?: boolean;
    email_setup?: boolean;
    software_access?: boolean;
    compliance_training?: boolean;
    job_description_review?: boolean;
    manager_checkin?: boolean;
  };
  q1: 'Yes' | 'No';
  q2: 'Yes' | 'No';
  q3: 'Yes' | 'No';
  q4: 'Yes' | 'No';
  q5: 'Yes' | 'No';
  q6: string[];
  q7: 'Yes' | 'No';
  q8: 'Yes' | 'No';
  q9: 'Yes' | 'No';
  q10: 'Yes' | 'No' | 'Choose not to use personal device for work purposes';
  q11: 'Yes' | 'No';
  q12: 'Yes' | 'No';
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  total_submissions: number;
  completion_rate: number;
  avg_completion_time: number;
  pending_submissions: number;
}

export interface DepartmentBreakdown {
  department: string;
  count: number;
}

export interface QuestionAnalysis {
  question: string;
  yes_count: number;
  no_count: number;
  other_count?: number;
}

export interface TrendData {
  date: string;
  count: number;
}
