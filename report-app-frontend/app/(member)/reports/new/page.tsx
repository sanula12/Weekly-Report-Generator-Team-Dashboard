'use client';
import { createReport } from '@/lib/api';
import ReportForm from '@/components/reports/ReportForm';

export default function NewReportPage() {
  const handleSaveDraft = async (data: object) => {
    await createReport(data);
  };

  const handleSubmit = async (data: object) => {
    const r = await createReport(data);
    const { submitReport } = await import('@/lib/api');
    await submitReport(r.id);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Report</h1>
        <p style={{ color: 'oklch(0.65 0.02 255)' }}>Draft a new weekly work report.</p>
      </div>
      <ReportForm onSaveDraft={handleSaveDraft} onSubmit={handleSubmit} />
    </div>
  );
}
