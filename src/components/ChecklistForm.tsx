"use client";

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { ChecklistSubmission } from '@/types';
import { submitChecklist } from '@/utils/api';
import SignatureCanvas from 'react-signature-canvas';

export default function ChecklistForm() {
  const [formData, setFormData] = useState<Partial<ChecklistSubmission>>({
    employee_name: '',
    employee_id: '',
    department: '',
    start_date: '',
    q1: undefined,
    q2: undefined,
    q3: undefined,
    q4: undefined,
    q5: undefined,
    q6: [],
    q7: undefined,
    q8: undefined,
    q9: undefined,
    q10: undefined,
    q11: undefined,
    q12: undefined,
    status: 'incomplete',
    completion_percentage: 0,
    comments: '',
    signature_date: new Date().toISOString().split('T')[0]
  });

  const [q6Error, setQ6Error] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Signature canvas ref
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for q6
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'q6') {
      setFormData(prev => {
        const currentQ6 = prev.q6 || [];
        if (checked) {
          return { ...prev, q6: [...currentQ6, value] };
        } else {
          return { ...prev, q6: currentQ6.filter(item => item !== value) };
        }
      });

      // Validate q6 (at least 3 options)
      const q6Count = checked 
        ? (formData.q6?.length || 0) + 1 
        : (formData.q6?.length || 0) - 1;

      if (q6Count >= 3) {
        setQ6Error('');
      } else {
        setQ6Error(`Please select at least 3 options (${q6Count}/3 selected)`);
      }
    }
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = () => 100;

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Only allow drawn signature
      let signatureValue = '';
      if (sigCanvas.current) {
        if (sigCanvas.current.isEmpty()) {
          setError('Please sign the form');
          setIsSubmitting(false);
          return;
        }
        signatureValue = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      }

      // Prepare data for submission
      const submissionData = {
        ...formData,
        signature: signatureValue,
        status: 'complete',
        completion_percentage: 100,
        submission_date: new Date().toISOString()
      };

      await submitChecklist(submissionData as any);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting the checklist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear signature pad
  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  // Handle reset form for new submission
  const handleNewForm = () => {
    setFormData({
      employee_name: '',
      employee_id: '',
      department: '',
      start_date: '',
      q1: undefined,
      q2: undefined,
      q3: undefined,
      q4: undefined,
      q5: undefined,
      q6: [],
      q7: undefined,
      q8: undefined,
      q9: undefined,
      q10: undefined,
      q11: undefined,
      q12: undefined,
      status: 'incomplete',
      completion_percentage: 0,
      comments: '',
      signature_date: new Date().toISOString().split('T')[0]
    });
    setIsSubmitted(false);
    setError('');
    setQ6Error('');
    if (sigCanvas.current) sigCanvas.current.clear();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Employee Information Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h2 className="text-2xl font-semibold text-[#0F1941] mb-4 pb-2 border-b">Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employee_name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    id="employee_name"
                    name="employee_name"
                    value={formData.employee_name || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="employee_id" className="block text-sm font-medium mb-1">Employee ID</label>
                  <input
                    type="text"
                    id="employee_id"
                    name="employee_id"
                    value={formData.employee_id || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium mb-1">Department</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Checklist Items Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h2 className="text-2xl font-semibold text-[#0F1941] mb-4 pb-2 border-b">Onboarding Checklist</h2>
              
              {/* Question 1 */}
              <div className="mb-6">
                <p className="font-medium mb-2">1. Employee received their Username/Password, and were you able to successfully login to your laptop.</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q1"
                      value="Yes"
                      checked={formData.q1 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q1"
                      value="No"
                      checked={formData.q1 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 2 */}
              <div className="mb-6">
                <p className="font-medium mb-2">2. Employee was able to setup Okta Verify or Google Auth</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q2"
                      value="Yes"
                      checked={formData.q2 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q2"
                      value="No"
                      checked={formData.q2 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 3 */}
              <div className="mb-6">
                <p className="font-medium mb-2">3. Employee was able to connect to and test the VPN</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q3"
                      value="Yes"
                      checked={formData.q3 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q3"
                      value="No"
                      checked={formData.q3 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 4 */}
              <div className="mb-6">
                <p className="font-medium mb-2">4. Employee setup their Employee Signature in Outlook</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q4"
                      value="Yes"
                      checked={formData.q4 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q4"
                      value="No"
                      checked={formData.q4 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 5 */}
              <div className="mb-6">
                <p className="font-medium mb-2">5. Employee was able to access OneDrive and was told how to use it and what folders are backed up automatically</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q5"
                      value="Yes"
                      checked={formData.q5 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q5"
                      value="No"
                      checked={formData.q5 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 6 */}
              <div className="mb-6">
                <p className="font-medium mb-2">6. Employee was shown how to access their Okta Tiles and verified the following tiles work:</p>
                <p className="text-sm text-gray-500 mb-2">Please select at least 3 options</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="q6"
                      value="Workday"
                      checked={formData.q6?.includes('Workday') || false}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Workday</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="q6"
                      value="Mimecast"
                      checked={formData.q6?.includes('Mimecast') || false}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Mimecast</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="q6"
                      value="Office 365"
                      checked={formData.q6?.includes('Office 365') || false}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Office 365</span>
                  </label>
                </div>
                {q6Error && <p className="text-red-500 text-sm mt-1">{q6Error}</p>}
              </div>

              {/* Question 7 */}
              <div className="mb-6">
                <p className="font-medium mb-2">7. Employee was able to login to Microsoft Teams</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q7"
                      value="Yes"
                      checked={formData.q7 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q7"
                      value="No"
                      checked={formData.q7 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 8 */}
              <div className="mb-6">
                <p className="font-medium mb-2">8. Employee was able to test and verify Zoom works, as well as the Zoom Plugin without Outlook</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q8"
                      value="Yes"
                      checked={formData.q8 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q8"
                      value="No"
                      checked={formData.q8 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 9 */}
              <div className="mb-6">
                <p className="font-medium mb-2">9. Employee was able to sign into Genesys Cloud both through the installed application AND online</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q9"
                      value="Yes"
                      checked={formData.q9 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q9"
                      value="No"
                      checked={formData.q9 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 10 */}
              <div className="mb-6">
                <p className="font-medium mb-2">10. Employee was shown how to setup the Company Portal on your phone</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q10"
                      value="Yes"
                      checked={formData.q10 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q10"
                      value="No"
                      checked={formData.q10 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q10"
                      value="Choose not to use personal device for work purposes"
                      checked={formData.q10 === 'Choose not to use personal device for work purposes'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Choose not to use personal device for work purposes</span>
                  </label>
                </div>
              </div>

              {/* Question 11 */}
              <div className="mb-6">
                <p className="font-medium mb-2">11. Employee checked for additional updates on their system (Windows/Dell Command/Apple)</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q11"
                      value="Yes"
                      checked={formData.q11 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q11"
                      value="No"
                      checked={formData.q11 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {/* Question 12 */}
              <div className="mb-6">
                <p className="font-medium mb-2">12. Verified their system is setup properly in InTune/Jamf</p>
                <div className="flex flex-col space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q12"
                      value="Yes"
                      checked={formData.q12 === 'Yes'}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="q12"
                      value="No"
                      checked={formData.q12 === 'No'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Comments Field */}
            <div className="mb-6">
              <label htmlFor="comments" className="block text-sm font-medium mb-1">Additional Comments (Optional)</label>
              <textarea
                id="comments"
                name="comments"
                value={formData.comments || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                placeholder="Please provide any additional comments or feedback..."
              />
            </div>

            {/* Signature Section */}
            <div className="bg-gray-50 p-6 rounded-md">
              <h2 className="text-2xl font-semibold text-[#0F1941] mb-4 pb-2 border-b">Acknowledgment</h2>
              <p className="mb-4">By signing below, I acknowledge that I have completed the above checklist items.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Draw Your Signature</label>
                  <div className="border border-gray-300 rounded-md bg-white overflow-x-auto" style={{maxWidth: '100%'}}>
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 700,
                        height: 200,
                        className: 'w-full h-[200px] signature-canvas',
                        style: {minWidth: '320px', maxWidth: '100%', display: 'block'}
                      }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={clearSignature}
                    className="mt-2 text-sm text-[#FF4F1F] hover:text-[#e63900]"
                  >
                    Clear Signature
                  </button>
                </div>
                <div>
                  <label htmlFor="signature_date" className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    id="signature_date"
                    name="signature_date"
                    value={formData.signature_date || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FF4F1F] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#e63900] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Checklist'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-[#0F1941] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#1a2456] transition-colors"
              >
                Save as PDF
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-[#FF4F1F] mb-4">Thank You!</h2>
          <p className="mb-2">Your checklist has been successfully submitted.</p>
          <p className="mb-6">A copy has been sent to HR and your manager.</p>
          <button
            onClick={handleNewForm}
            className="bg-[#0F1941] text-white py-3 px-6 rounded-md font-semibold hover:bg-[#1a2456] transition-colors"
          >
            Complete Another Form
          </button>
        </div>
      )}
    </div>
  );
}
