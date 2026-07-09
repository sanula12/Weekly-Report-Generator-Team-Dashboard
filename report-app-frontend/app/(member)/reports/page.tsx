'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getMyReports, submitReport, deleteReport } from '@/lib/api';
import { Report } from '@/lib/types';
import ReportCard from '@/components/reports/ReportCard';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();

  const load = () => getMyReports().then(setReports).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (id: string) => {
    try { await submitReport(id); load(); }
    catch (e) { console.error('Submit failed', e); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteReport(id); load(); }
    catch (e) { console.error('Delete failed', e); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Reports</h1>
          <p style={{ color: 'oklch(0.65 0.02 255)' }}>Track and submit your weekly work reports.</p>
        </div>
        <Link
          href="/reports/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
          style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          New Report
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ border: '1px dashed oklch(1 0 0 / 15%)' }}>
          <p className="text-lg text-white mb-2">No reports yet</p>
          <p className="text-sm mb-6" style={{ color: 'oklch(0.6 0.02 255)' }}>Create your first weekly report to get started.</p>
          <Link
            href="/reports/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'oklch(0.185 0.018 255)', color: 'white', border: '1px solid oklch(1 0 0 / 10%)' }}
          >
            Create Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map(r => (
            <ReportCard
              key={r.id}
              report={r}
              onSubmit={handleSubmit}
              onEdit={id => router.push(`/reports/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}