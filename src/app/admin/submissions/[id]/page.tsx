"use client";

import { useParams } from 'next/navigation';
import SubmissionDetail from '@/components/admin/SubmissionDetail';

export default function SubmissionDetailPage() {
  const params = useParams();
  const submissionId = params.id as string;
  
  return <SubmissionDetail submissionId={submissionId} />;
}
