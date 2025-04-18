import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById } from '@/utils/api';
import { mapSubmissionResponses } from '@/utils/mappers';

export async function GET(request: NextRequest) {
  try {
    // Extract the id param from the URL
    const url = new URL(request.url);
    // /api/export-pdf/[id] => get last segment
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'Missing submission id' }, { status: 400 });
    }
    // Get the submission data
    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }
    // Map the submission data to include the structured responses
    const mappedSubmission = mapSubmissionResponses(submission);
    // In a real application, we would generate a PDF here using a library like PDFKit or jsPDF
    // For this example, we'll just return the data that would be used to generate the PDF
    
    // Set headers to indicate this is a PDF (in a real implementation)
    // const headers = new Headers();
    // headers.set('Content-Type', 'application/pdf');
    // headers.set('Content-Disposition', `attachment; filename="checklist-${id}.pdf"`); 
    
    // For now, just return the JSON data
    return NextResponse.json({
      success: true,
      message: 'PDF export data (would be a real PDF in production)',
      data: mappedSubmission
    });
    
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 });
  }
}
