import { Report } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, FileEdit } from 'lucide-react';

export default function ActivityFeed({ activities }: { activities: Report[] }) {
  if (!activities?.length) return <p className="text-sm text-white/50 p-4">No recent activity.</p>;

  return (
    <div className="space-y-4">
      {activities.map((a, i) => {
        const isSubmitted = a.status === 'SUBMITTED';
        return (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
              background: isSubmitted ? 'oklch(0.696 0.17 162 / 15%)' : 'oklch(0.768 0.17 70 / 15%)',
              color: isSubmitted ? 'oklch(0.696 0.17 162)' : 'oklch(0.768 0.17 70)'
            }}>
              {isSubmitted ? <CheckCircle2 className="w-4 h-4" /> : <FileEdit className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                <span className="font-semibold">{a.user.name}</span>{' '}
                {isSubmitted ? 'submitted their weekly report' : 'updated their draft'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.55 0.02 255)' }}>
                {a.updatedAt ? formatDistanceToNow(new Date(a.updatedAt), { addSuffix: true }) : 'Recently'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
