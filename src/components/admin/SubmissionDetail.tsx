"use client";

import { useState, useEffect } from 'react';
import { ChecklistSubmission } from '@/types';
import { getSubmissionById } from '@/utils/api';
import { mapSubmissionResponses } from '@/utils/mappers';

interface SubmissionDetailProps {
  submissionId: string;
}

export default function SubmissionDetail({ submissionId }: SubmissionDetailProps) {
  const [submission, setSubmission] = useState<ChecklistSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSubmission() {
      try {
        setLoading(true);
        setError('');
        const data = await getSubmissionById(submissionId);
        // Map the individual question responses to the structured responses object
        const mappedData = mapSubmissionResponses(data);
        setSubmission(mappedData);
      } catch (err) {
        console.error('Error loading submission:', err);
        setError('Failed to load submission details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadSubmission();
  }, [submissionId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Complete</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'incomplete':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Incomplete</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading submission details...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }

  if (!submission) {
    return <div className="bg-yellow-100 text-yellow-700 p-4 rounded-md">Submission not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0F1941]">Submission Details</h1>
        <div className="flex space-x-2">
          <button 
            className="bg-[#0F1941] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1a2456] transition-colors"
            onClick={() => window.open(`/api/export-pdf/${submission.id}`, '_blank')}
          >
            Export PDF
          </button>
          <button 
            className="bg-[#FF4F1F] text-white px-4 py-2 rounded-md font-medium hover:bg-[#e63900] transition-colors"
            onClick={() => window.history.back()}
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Employee Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Employee Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg font-semibold">{submission.employee_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Employee ID</p>
            <p className="text-lg font-semibold">{submission.employee_id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Department</p>
            <p className="text-lg font-semibold">{submission.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="text-lg font-semibold">{formatDate(submission.start_date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Submission Date</p>
            <p className="text-lg font-semibold">{formatDate(submission.submission_date)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <div className="mt-1">{formatStatus(submission.status)}</div>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Signature</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Employee Signature</p>
            {submission.signature && submission.signature.startsWith('data:image') ? (
              <div className="border p-2 rounded-md bg-gray-50">
                <img 
                  src={submission.signature} 
                  alt="Employee Signature" 
                  className="max-h-32 max-w-full"
                />
              </div>
            ) : (
              <p className="text-lg font-semibold p-2 border rounded-md bg-gray-50">{submission.signature}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Signature Date</p>
            <p className="text-lg font-semibold">{formatDate(submission.signature_date)}</p>
          </div>
        </div>
      </div>

      {/* Checklist Responses */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Checklist Responses</h2>
        
        <div className="space-y-6">
          {/* Company Overview Section */}
          <div>
            <h3 className="text-md font-semibold text-[#0F1941] mb-2">Company Overview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">1. Did you receive and review the company handbook?</p>
                <p className="mt-1">{submission.responses?.company_handbook ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">2. Have you been introduced to your team members?</p>
                <p className="mt-1">{submission.responses?.team_introduction ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">3. Did you attend the company orientation session?</p>
                <p className="mt-1">{submission.responses?.orientation_session ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {/* HR & Benefits Section */}
          <div>
            <h3 className="text-md font-semibold text-[#0F1941] mb-2">HR & Benefits</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">4. Have you completed all required tax forms?</p>
                <p className="mt-1">{submission.responses?.tax_forms ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">5. Did you enroll in the company benefits program?</p>
                <p className="mt-1">{submission.responses?.benefits_enrollment ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">6. Have you set up your direct deposit for payroll?</p>
                <p className="mt-1">{submission.responses?.direct_deposit ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {/* IT Setup Section */}
          <div>
            <h3 className="text-md font-semibold text-[#0F1941] mb-2">IT Setup</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">7. Did you receive your company laptop/equipment?</p>
                <p className="mt-1">{submission.responses?.equipment_received ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">8. Have you set up your company email account?</p>
                <p className="mt-1">{submission.responses?.email_setup ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">9. Do you have access to all required software and systems?</p>
                <p className="mt-1">{submission.responses?.software_access ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
          
          {/* Training & Development Section */}
          <div>
            <h3 className="text-md font-semibold text-[#0F1941] mb-2">Training & Development</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">10. Have you completed the required compliance training?</p>
                <p className="mt-1">{submission.responses?.compliance_training ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">11. Did you review your job description and responsibilities?</p>
                <p className="mt-1">{submission.responses?.job_description_review ? 'Yes' : 'No'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm font-medium">12. Have you scheduled your first check-in with your manager?</p>
                <p className="mt-1">{submission.responses?.manager_checkin ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Comments */}
      {submission.comments && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Additional Comments</h2>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm italic">{submission.comments}</p>
          </div>
        </div>
      )}

      {/* Completion Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Completion Status</h2>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
            <div 
              className="bg-[#FF4F1F] h-4 rounded-full" 
              style={{ width: `${submission.completion_percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{submission.completion_percentage}%</span>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-[#0F1941] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1a2456] transition-colors"
            onClick={() => alert('Send reminder functionality would be implemented here')}
          >
            Send Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
