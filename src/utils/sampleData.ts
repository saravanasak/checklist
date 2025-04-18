/**
 * Utility functions for generating sample data for the admin dashboard
 * This is used for demonstration purposes and would be replaced with real data from Supabase in production
 */

import { ChecklistSubmission, DashboardStats, DepartmentBreakdown, QuestionAnalysis, TrendData } from '@/types';

/**
 * Generate sample dashboard statistics
 * @returns Sample dashboard statistics
 */
export function generateSampleStats(): DashboardStats {
  return {
    total_submissions: 157,
    completion_rate: 82.5,
    avg_completion_time: 3.2,
    pending_submissions: 12
  };
}

/**
 * Generate sample department breakdown data
 * @returns Sample department breakdown data
 */
export function generateSampleDepartmentData(): DepartmentBreakdown[] {
  return [
    { department: 'IT Support', count: 42 },
    { department: 'Customer Service', count: 35 },
    { department: 'Sales', count: 28 },
    { department: 'HR', count: 15 },
    { department: 'Development', count: 37 }
  ];
}

/**
 * Generate sample question analysis data
 * @returns Sample question analysis data
 */
export function generateSampleQuestionData(): QuestionAnalysis[] {
  return [
    { question: 'Question 1', yes_count: 142, no_count: 15 },
    { question: 'Question 2', yes_count: 138, no_count: 19 },
    { question: 'Question 3', yes_count: 125, no_count: 32 },
    { question: 'Question 4', yes_count: 145, no_count: 12 },
    { question: 'Question 5', yes_count: 130, no_count: 27 },
    { question: 'Question 6', yes_count: 120, no_count: 37 },
    { question: 'Question 7', yes_count: 135, no_count: 22 },
    { question: 'Question 8', yes_count: 140, no_count: 17 },
    { question: 'Question 9', yes_count: 128, no_count: 29 },
    { question: 'Question 10', yes_count: 115, no_count: 42, other_count: 0 },
    { question: 'Question 11', yes_count: 132, no_count: 25 },
    { question: 'Question 12', yes_count: 136, no_count: 21 }
  ];
}

/**
 * Generate sample trend data for submissions over time
 * @returns Sample trend data
 */
export function generateSampleTrendData(): TrendData[] {
  const today = new Date();
  const data: TrendData[] = [];
  
  // Generate data for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    
    // Generate random count between 0 and 8
    const count = Math.floor(Math.random() * 9);
    
    data.push({
      date: formattedDate,
      count
    });
  }
  
  return data;
}

/**
 * Generate sample checklist submissions
 * @param count Number of submissions to generate
 * @returns Sample checklist submissions
 */
export function generateSampleSubmissions(count: number = 20): ChecklistSubmission[] {
  const submissions: ChecklistSubmission[] = [];
  const today = new Date();
  
  const departments = ['IT Support', 'Customer Service', 'Sales', 'HR', 'Development'];
  const statuses = ['complete', 'incomplete', 'pending'] as const;
  
  for (let i = 1; i <= count; i++) {
    // Generate random dates within the last 60 days
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60));
    
    const submissionDate = new Date(startDate);
    submissionDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5));
    
    // Generate random status
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const status = statuses[statusIndex];
    
    // Generate random completion percentage based on status
    let completionPercentage;
    if (status === 'complete') {
      completionPercentage = 100;
    } else if (status === 'pending') {
      completionPercentage = Math.floor(Math.random() * 41) + 50; // 50-90%
    } else {
      completionPercentage = Math.floor(Math.random() * 50); // 0-49%
    }
    
    // Generate random department
    const departmentIndex = Math.floor(Math.random() * departments.length);
    const department = departments[departmentIndex];
    
    // Generate random answers
    const yesNoAnswer = () => Math.random() > 0.2 ? 'Yes' : 'No';
    
    submissions.push({
      id: `sample-${i}`,
      employee_name: `Employee ${i}`,
      employee_id: `EMP-${1000 + i}`,
      department,
      start_date: startDate.toISOString().split('T')[0],
      submission_date: submissionDate.toISOString().split('T')[0],
      signature: `Employee ${i}`,
      signature_date: submissionDate.toISOString().split('T')[0],
      status,
      completion_percentage: completionPercentage,
      q1: yesNoAnswer(),
      q2: yesNoAnswer(),
      q3: yesNoAnswer(),
      q4: yesNoAnswer(),
      q5: yesNoAnswer(),
      q6: ['Option 1', 'Option 2', 'Option 3'],
      q7: yesNoAnswer(),
      q8: yesNoAnswer(),
      q9: yesNoAnswer(),
      q10: yesNoAnswer(),
      q11: yesNoAnswer(),
      q12: yesNoAnswer(),
      comments: Math.random() > 0.7 ? 'Sample comment for this submission.' : undefined,
      created_at: submissionDate.toISOString(),
      updated_at: submissionDate.toISOString(),
      responses: {
        company_handbook: Math.random() > 0.2,
        team_introduction: Math.random() > 0.2,
        orientation_session: Math.random() > 0.2,
        tax_forms: Math.random() > 0.2,
        benefits_enrollment: Math.random() > 0.2,
        direct_deposit: Math.random() > 0.2,
        equipment_received: Math.random() > 0.2,
        email_setup: Math.random() > 0.2,
        software_access: Math.random() > 0.2,
        compliance_training: Math.random() > 0.2,
        job_description_review: Math.random() > 0.2,
        manager_checkin: Math.random() > 0.2
      }
    });
  }
  
  return submissions;
}
