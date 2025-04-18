import { ChecklistSubmission } from '@/types';

/**
 * Validates the checklist form data
 * @param formData Partial checklist submission data
 * @returns Object containing validation result and any error messages
 */
export function validateChecklistForm(formData: Partial<ChecklistSubmission>): { 
  isValid: boolean; 
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  
  // Required fields
  const requiredFields = [
    { key: 'employee_name', label: 'Employee Name' },
    { key: 'employee_id', label: 'Employee ID' },
    { key: 'department', label: 'Department' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'signature', label: 'Signature' },
    { key: 'signature_date', label: 'Signature Date' }
  ];
  
  // Validate required fields
  requiredFields.forEach(field => {
    if (!formData[field.key as keyof ChecklistSubmission]) {
      errors[field.key] = `${field.label} is required`;
    }
  });
  
  // Validate all questions are answered
  for (let i = 1; i <= 12; i++) {
    const questionKey = `q${i}` as keyof ChecklistSubmission;
    
    // Skip q6 as it's a special case (array of checkboxes)
    if (questionKey === 'q6') continue;
    
    if (!formData[questionKey]) {
      errors[questionKey] = `Question ${i} must be answered`;
    }
  }
  
  // Validate q6 (checkbox array) - must have at least 3 selections
  if (!formData.q6 || formData.q6.length < 3) {
    errors.q6 = 'Please select at least 3 options';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Determines the status of a checklist submission based on completion percentage
 * @param completionPercentage The percentage of completion
 * @returns The status of the submission
 */
export function determineSubmissionStatus(completionPercentage: number): 'complete' | 'incomplete' | 'pending' {
  if (completionPercentage === 100) {
    return 'complete';
  } else if (completionPercentage >= 50) {
    return 'pending';
  } else {
    return 'incomplete';
  }
}
