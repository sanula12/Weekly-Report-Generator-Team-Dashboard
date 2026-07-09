'use client';
import { useEffect, useState } from 'react';
import { getReportById } from '@/lib/api';
import { Report } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Calendar, Clock, AlertCircle, CheckCircle2, FileEdit } from 'lucide-react';
import Link from 'next/link';

const statusConfig = {
  SUBMITTED: { label: 'Submitted', color: 'oklch(0.696 0.17 162)', bg: 'oklch(0.696 0.17 162 / 12%)', icon: CheckCircle2 },
  DRAFT: { label: 'Draft', color: 'oklch(0.768 0.17 70)', bg: 'oklch(0.768 0.17 70 / 12%)', icon: FileEdit },
  LATE: { label: 'Late', color: 'oklch(0.646 0.22 31)', bg: 'oklch(0.646 0.22 31 / 12%)', icon: AlertCircle },
};

export default function ViewReportPage() {
  const { id } = useParams() as { id: string };
  const [report, setReport] = useState<Report | null>(null);
  const router = useRouter();

  useEffect(() => {
    getReportById(id).then(setReport).catch(() => router.push('/dashboard'));
  }, [id, router]);

  if (!report) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-white w-6 h-6" /></div>;

  const status = statusConfig[report.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:text-white" style={{ color: 'oklch(0.65 0.02 255)' }}>
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
        <div className="p-6 md:p-8 border-b" style={{ borderColor: 'oklch(1 0 0 / 8%)' }}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{report.user.name}'s Report</h1>
              <div className="flex items-center gap-4 text-sm font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> 
                  {new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}
                </span>
                {report.project && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs" style={{ background: 'oklch(0.585 0.207 264 / 15%)', color: 'oklch(0.7 0.15 264)' }}>
                    {report.project.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium self-start" style={{ background: status.bg, color: status.color }}>
              <StatusIcon className="w-4 h-4" />
              {status.label}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.66 0.19 264)' }} />
              Tasks Completed
            </h3>
            <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed p-4 rounded-xl" style={{ background: 'oklch(0.16 0.018 255)' }}>
              {report.tasksCompleted}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.768 0.17 70)' }} />
              Tasks Planned for Next Week
            </h3>
            <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed p-4 rounded-xl" style={{ background: 'oklch(0.16 0.018 255)' }}>
              {report.tasksPlanned}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.646 0.22 31)' }} />
                Blockers / Challenges
              </h3>
              <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed p-4 rounded-xl h-[calc(100%-28px)]" style={{ background: 'oklch(0.16 0.018 255)' }}>
                {report.blockers || <span className="opacity-50 italic">No blockers reported.</span>}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.585 0.207 264)' }} />
                  Hours Worked
                </h3>
                <div className="flex items-center gap-2 text-lg font-bold text-white p-4 rounded-xl" style={{ background: 'oklch(0.16 0.018 255)' }}>
                  <Clock className="w-5 h-5" style={{ color: 'oklch(0.585 0.207 264)' }} />
                  {report.hoursWorked ? `${report.hoursWorked} hours` : 'Not specified'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.65 0.02 255)' }} />
                  Notes / Links
                </h3>
                <div className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed p-4 rounded-xl" style={{ background: 'oklch(0.16 0.018 255)' }}>
                  {report.notes || <span className="opacity-50 italic">No notes provided.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
