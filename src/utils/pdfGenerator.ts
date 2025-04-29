import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChecklistSubmission } from '@/types';

/**
 * Generate a PDF from checklist submission data
 * @param submission The checklist submission data
 * @param signatureDataUrl Base64 signature image data
 * @returns Promise with the PDF as a Blob
 */
export async function generateChecklistPDF(submission: ChecklistSubmission, signatureDataUrl: string): Promise<Blob> {
  // Create a new PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Add header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Employee Onboarding Checklist', pageWidth / 2, 20, { align: 'center' });
  
  // Add employee information
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  let y = 35;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Employee Information', margin, y);
  pdf.setFont('helvetica', 'normal');
  y += 10;
  
  pdf.text(`Name: ${submission.employee_name || ''}`, margin, y);
  y += 7;
  pdf.text(`Employee ID: ${submission.employee_id || ''}`, margin, y);
  y += 7;
  pdf.text(`Department: ${submission.department || ''}`, margin, y);
  y += 7;
  pdf.text(`Start Date: ${formatDate(submission.start_date || '')}`, margin, y);
  y += 15;
  
  // Add checklist items
  pdf.setFont('helvetica', 'bold');
  pdf.text('Onboarding Checklist Items', margin, y);
  pdf.setFont('helvetica', 'normal');
  y += 10;
  
  // Define questions
  const questions = {
    q1: "Employee received Username/Password and successfully logged in to laptop",
    q2: "Employee set up Okta Verify or Google Auth",
    q3: "Employee connected to and tested the VPN",
    q4: "Employee set up email signature in Outlook",
    q5: "Employee accessed OneDrive and understood backup folders",
    q6: "Employee verified Okta Tiles",
    q7: "Employee logged in to Microsoft Teams",
    q8: "Employee tested Zoom and Outlook Zoom Plugin",
    q9: "Employee signed into Genesys Cloud (app and online)",
    q10: "Employee set up Company Portal on phone",
    q11: "Employee checked for system updates",
    q12: "System properly set up in InTune/Jamf"
  };
  
  // Add each question and response
  Object.entries(questions).forEach(([key, question], index) => {
    // Check if we need a new page
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }
    
    const response = submission[key as keyof ChecklistSubmission];
    let responseText = '';
    
    if (key === 'q6' && Array.isArray(response)) {
      responseText = response.join(', ');
    } else {
      responseText = response?.toString() || 'N/A';
    }
    
    pdf.text(`${index + 1}. ${question}`, margin, y);
    y += 7;
    pdf.text(`   Response: ${responseText}`, margin, y);
    y += 10;
  });
  
  // Add comments if any
  if (submission.comments) {
    // Check if we need a new page
    if (y > 230) {
      pdf.addPage();
      y = 20;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Additional Comments', margin, y);
    pdf.setFont('helvetica', 'normal');
    y += 10;
    
    // Split comments into lines to fit the page width
    const commentLines = pdf.splitTextToSize(submission.comments, contentWidth);
    pdf.text(commentLines, margin, y);
    y += (commentLines.length * 7) + 10;
  }
  
  // Add signature
  // Check if we need a new page
  if (y > 200) {
    pdf.addPage();
    y = 20;
  }
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Acknowledgment', margin, y);
  pdf.setFont('helvetica', 'normal');
  y += 10;
  
  pdf.text('I acknowledge that I have completed the above checklist items.', margin, y);
  y += 20;
  
  // Add signature image if available
  if (signatureDataUrl) {
    try {
      pdf.addImage(signatureDataUrl, 'PNG', margin, y, 60, 30);
      y += 35;
    } catch (error) {
      console.error('Error adding signature to PDF:', error);
      pdf.text('Signature: [Error displaying signature]', margin, y);
      y += 10;
    }
  } else {
    pdf.text('Signature: [No signature provided]', margin, y);
    y += 10;
  }
  
  // Add date
  pdf.text(`Date: ${formatDate(submission.signature_date || '')}`, margin, y);
  
  // Return the PDF as a blob
  return pdf.output('blob');
}

/**
 * Format a date string as MM/DD/YYYY
 */
function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Generate a PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param filename The filename for the PDF
 */
export async function generatePDFFromElement(element: HTMLElement, filename: string): Promise<Blob> {
  try {
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true
    });
    
    // Create PDF from canvas
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Return the PDF as a blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
