import { ChecklistSubmission } from '@/types';

/**
 * Maps the individual question responses (q1, q2, etc.) to the structured responses object
 * This is used when displaying submission details in the admin panel
 */
export function mapSubmissionResponses(submission: ChecklistSubmission): ChecklistSubmission {
  if (!submission) return submission;
  
  // Create a copy of the submission to avoid mutating the original
  const result = { ...submission };
  
  // Map individual question responses to the structured responses object
  result.responses = {
    company_handbook: submission.q1 === 'Yes',
    team_introduction: submission.q2 === 'Yes',
    orientation_session: submission.q3 === 'Yes',
    tax_forms: submission.q4 === 'Yes',
    benefits_enrollment: submission.q5 === 'Yes',
    direct_deposit: submission.q7 === 'Yes',
    equipment_received: submission.q8 === 'Yes',
    email_setup: submission.q9 === 'Yes',
    software_access: submission.q10 === 'Yes',
    compliance_training: submission.q11 === 'Yes',
    job_description_review: submission.q12 === 'Yes',
    manager_checkin: submission.q12 === 'Yes'
  };
  
  return result;
}

/**
 * Calculates the completion percentage based on the responses
 */
export function calculateCompletionPercentage(submission: Partial<ChecklistSubmission>): number {
  if (!submission) return 0;
  
  const requiredFields = [
    'employee_name', 'employee_id', 'department', 'start_date',
    'q1', 'q2', 'q3', 'q4', 'q5', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12',
    'signature', 'signature_date'
  ];
  
  const filledFields = requiredFields.filter(field => 
    submission[field as keyof ChecklistSubmission] !== undefined && 
    submission[field as keyof ChecklistSubmission] !== ''
  );

  // Check q6 separately (needs at least 3 selections)
  const q6Valid = (submission.q6?.length || 0) >= 3;

  // Calculate percentage
  return Math.round((filledFields.length / requiredFields.length) * 100) * (q6Valid ? 1 : 0.9);
}
