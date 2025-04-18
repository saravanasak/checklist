import { supabase } from '@/lib/supabase';
import { ChecklistSubmission, DashboardStats, DepartmentBreakdown, QuestionAnalysis, TrendData } from '@/types';

// Submit a new checklist
export async function submitChecklist(data: ChecklistSubmission) {
  // Log the data being submitted for debugging
  console.log('Submitting checklist data:', data);
  
  // Ensure dates and signature are in the correct format for PostgreSQL
  const formattedData = {
    employee_name: data.employee_name,
    employee_id: data.employee_id,
    department: data.department,
    start_date: data.start_date,
    submission_date: data.submission_date,
    signature: data.signature || 'No signature provided', // Ensure signature is never null
    signature_date: data.signature_date,
    status: 'complete', // Always set to complete
    completion_percentage: 100, // Always 100
    q1: data.q1,
    q2: data.q2,
    q3: data.q3,
    q4: data.q4,
    q5: data.q5,
    q6: data.q6,
    q7: data.q7,
    q8: data.q8,
    q9: data.q9,
    q10: data.q10,
    q11: data.q11,
    q12: data.q12,
    comments: data.comments || null // Include comments field if it exists
  };

  // Validate required fields before submission
  if (!formattedData.signature) {
    throw new Error('Signature is required');
  }

  const { data: submission, error } = await supabase
    .from('checklist_submissions')
    .insert([formattedData])
    .select();

  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }

  return submission;
}

// Get all checklist submissions
export async function getAllSubmissions() {
  const { data, error } = await supabase
    .from('checklist_submissions')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as ChecklistSubmission[];
}

// Get a single submission by ID
export async function getSubmissionById(id: string) {
  const { data, error } = await supabase
    .from('checklist_submissions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ChecklistSubmission;
}

// Get filtered submissions
export async function getFilteredSubmissions({
  department,
  status,
  startDate,
  endDate
}: {
  department?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  let query = supabase.from('checklist_submissions').select('*');

  if (department && department !== 'all') {
    query = query.eq('department', department);
  }

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (startDate) {
    query = query.gte('submission_date', startDate);
  }

  if (endDate) {
    query = query.lte('submission_date', endDate);
  }

  const { data, error } = await query.order('submission_date', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as ChecklistSubmission[];
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  // Get total submissions
  const { count: totalSubmissions, error: countError } = await supabase
    .from('checklist_submissions')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(countError.message);
  }

  // Get complete submissions for completion rate
  const { count: completeSubmissions, error: completeError } = await supabase
    .from('checklist_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'complete');

  if (completeError) {
    throw new Error(completeError.message);
  }

  // Get pending submissions
  const { count: pendingSubmissions, error: pendingError } = await supabase
    .from('checklist_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (pendingError) {
    throw new Error(pendingError.message);
  }

  // Calculate average completion time (days between start_date and submission_date)
  const { data: submissions, error: submissionsError } = await supabase
    .from('checklist_submissions')
    .select('start_date, submission_date')
    .eq('status', 'complete');

  if (submissionsError) {
    throw new Error(submissionsError.message);
  }

  let totalDays = 0;
  submissions.forEach((submission) => {
    const startDate = new Date(submission.start_date);
    const submissionDate = new Date(submission.submission_date);
    const diffTime = Math.abs(submissionDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalDays += diffDays;
  });

  const avgCompletionTime = submissions.length > 0 ? totalDays / submissions.length : 0;

  return {
    total_submissions: totalSubmissions || 0,
    completion_rate: totalSubmissions ? (completeSubmissions || 0) / totalSubmissions * 100 : 0,
    avg_completion_time: avgCompletionTime,
    pending_submissions: pendingSubmissions || 0
  };
}

// Get department breakdown
export async function getDepartmentBreakdown(): Promise<DepartmentBreakdown[]> {
  const { data, error } = await supabase
    .from('checklist_submissions')
    .select('department');

  if (error) {
    throw new Error(error.message);
  }

  const departments: Record<string, number> = {};
  data.forEach((submission) => {
    const dept = submission.department;
    departments[dept] = (departments[dept] || 0) + 1;
  });

  return Object.entries(departments).map(([department, count]) => ({
    department,
    count
  }));
}

// Get question analysis
export async function getQuestionAnalysis(): Promise<QuestionAnalysis[]> {
  const { data, error } = await supabase
    .from('checklist_submissions')
    .select('q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12');

  if (error) {
    throw new Error(error.message);
  }

  const analysis: QuestionAnalysis[] = [];

  // Analyze each question
  for (let i = 1; i <= 12; i++) {
    const questionKey = `q${i}` as keyof typeof data[0];
    const responses = data.map(submission => submission[questionKey]);

    // Special case for q6 which is an array
    if (questionKey === 'q6') {
      // For q6, we'll count occurrences of each option
      continue;
    }

    // Special case for q10 which has three options
    if (questionKey === 'q10') {
      const yesCounts = responses.filter(r => r === 'Yes').length;
      const noCounts = responses.filter(r => r === 'No').length;
      const otherCounts = responses.filter(r => r === 'Choose not to use personal device for work purposes').length;

      analysis.push({
        question: `Question ${i}`,
        yes_count: yesCounts,
        no_count: noCounts,
        other_count: otherCounts
      });
    } else {
      // Standard Yes/No questions
      const yesCounts = responses.filter(r => r === 'Yes').length;
      const noCounts = responses.filter(r => r === 'No').length;

      analysis.push({
        question: `Question ${i}`,
        yes_count: yesCounts,
        no_count: noCounts
      });
    }
  }

  return analysis;
}

// Get trend data for submissions over time
export async function getTrendData(period: 'week' | 'month' | 'quarter' | 'year'): Promise<TrendData[]> {
  let startDate;
  const now = new Date();
  
  // Calculate start date based on period
  switch (period) {
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'quarter':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
  }

  const { data, error } = await supabase
    .from('checklist_submissions')
    .select('submission_date')
    .gte('submission_date', startDate.toISOString());

  if (error) {
    throw new Error(error.message);
  }

  // Group submissions by date
  const dateGroups: Record<string, number> = {};
  data.forEach((submission) => {
    // Format date as YYYY-MM-DD
    const date = submission.submission_date.split('T')[0];
    dateGroups[date] = (dateGroups[date] || 0) + 1;
  });

  // Convert to array format
  return Object.entries(dateGroups).map(([date, count]) => ({
    date,
    count
  }));
}
