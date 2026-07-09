import { Report } from '@/lib/types';
import { Calendar, Clock, AlertCircle, CheckCircle2, FileEdit } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onSubmit?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  SUBMITTED: { label: 'Submitted', color: 'oklch(0.696 0.17 162)', bg: 'oklch(0.696 0.17 162 / 12%)', icon: CheckCircle2 },
  DRAFT: { label: 'Draft', color: 'oklch(0.768 0.17 70)', bg: 'oklch(0.768 0.17 70 / 12%)', icon: FileEdit },
  LATE: { label: 'Late', color: 'oklch(0.646 0.22 31)', bg: 'oklch(0.646 0.22 31 / 12%)', icon: AlertCircle },
};

export default function ReportCard({ report, onSubmit, onEdit, onDelete }: ReportCardProps) {
  const status = statusConfig[report.status] || statusConfig.DRAFT;
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl p-5 transition-all duration-200 hover:scale-[1.01]" style={{
      background: 'oklch(0.185 0.018 255)',
      border: '1px solid oklch(1 0 0 / 8%)'
    }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'oklch(0.66 0.19 264)' }} />
            <span className="text-sm font-semibold text-white">
              {new Date(report.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' - '}
              {new Date(report.weekEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          {report.project && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-1" style={{
              background: 'oklch(0.585 0.207 264 / 15%)',
              color: 'oklch(0.7 0.15 264)'
            }}>
              {report.project.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0" style={{
          background: status.bg, color: status.color
        }}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: 'oklch(0.55 0.02 255)' }}>Tasks Completed</p>
          <p className="text-sm text-white/80 line-clamp-2">{report.tasksCompleted}</p>
        </div>
        {report.blockers && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg" style={{ background: 'oklch(0.646 0.22 31 / 10%)' }}>
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'oklch(0.72 0.20 31)' }} />
            <p className="text-xs" style={{ color: 'oklch(0.72 0.20 31)' }}>{report.blockers}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs" style={{ color: 'oklch(0.55 0.02 255)' }}>
          {report.hoursWorked && <><Clock className="w-3 h-3" /><span>{report.hoursWorked}h worked</span></>}
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(report.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/10"
              style={{ color: 'oklch(0.7 0.02 255)', border: '1px solid oklch(1 0 0 / 10%)' }}
            >
              Edit
            </button>
          )}
          {onSubmit && report.status === 'DRAFT' && (
            <button
              onClick={() => onSubmit(report.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
            >
              Submit
            </button>
          )}
          {onDelete && report.status === 'DRAFT' && (
            <button
              onClick={() => onDelete(report.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10"
              style={{ color: 'oklch(0.704 0.191 22.216)', border: '1px solid oklch(0.577 0.245 27.325 / 30%)' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
