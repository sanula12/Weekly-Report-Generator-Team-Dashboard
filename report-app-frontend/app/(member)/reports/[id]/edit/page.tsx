'use client';
import { useEffect, useState } from 'react';
import { getReportById, updateReport } from '@/lib/api';
import { Report } from '@/lib/types';
import ReportForm from '@/components/reports/ReportForm';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function EditReportPage() {
  const { id } = useParams() as { id: string };
  const [report, setReport] = useState<Report | null>(null);
  const router = useRouter();

  useEffect(() => {
    getReportById(id).then(setReport).catch(() => router.push('/reports'));
  }, [id, router]);

  const handleSaveDraft = async (data: object) => {
    await updateReport(id, data);
  };

  const handleSubmit = async (data: object) => {
    await updateReport(id, data);
    const { submitReport } = await import('@/lib/api');
    await submitReport(id);
  };

  if (!report) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-white w-6 h-6" /></div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Report</h1>
        <p style={{ color: 'oklch(0.65 0.02 255)' }}>Update your draft report.</p>
      </div>
      <ReportForm initialData={report} onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} isEdit />
    </div>
  );
}
