'use client';
import { User, Report } from '@/lib/types';
import { CheckCircle2, FileEdit, AlertCircle } from 'lucide-react';

interface MemberStatusTableProps {
  users: User[];
  reports: Report[]; // These should be the current week's reports
}

export default function MemberStatusTable({ users, reports }: MemberStatusTableProps) {
  // Determine the status for each user
  const memberStatuses = users.map(user => {
    const userReport = reports.find(r => r.user.id === user.id);
    let status = 'MISSING';
    if (userReport) {
      status = userReport.status;
    }
    return { user, status, reportId: userReport?.id };
  });

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'Submitted', color: 'oklch(0.696 0.17 162)', bg: 'oklch(0.696 0.17 162 / 15%)', icon: CheckCircle2 };
      case 'DRAFT':
        return { label: 'Drafting', color: 'oklch(0.768 0.17 70)', bg: 'oklch(0.768 0.17 70 / 15%)', icon: FileEdit };
      case 'LATE':
        return { label: 'Late', color: 'oklch(0.646 0.22 31)', bg: 'oklch(0.646 0.22 31 / 15%)', icon: AlertCircle };
      default:
        return { label: 'Missing', color: 'oklch(0.704 0.191 22.216)', bg: 'oklch(0.704 0.191 22.216 / 15%)', icon: AlertCircle };
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'oklch(1 0 0 / 8%)' }}>
        <h3 className="text-lg font-bold text-white">Submission Status (This Week)</h3>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.02 255)' }}>Track who has completed their weekly reports.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[500px]">
          <thead style={{ background: 'oklch(0.16 0.018 255)' }}>
            <tr>
              <th className="px-6 py-4 font-semibold text-white">Team Member</th>
              <th className="px-6 py-4 font-semibold text-white">Role</th>
              <th className="px-6 py-4 font-semibold text-white">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {memberStatuses.map(({ user, status }) => {
              const display = getStatusDisplay(status);
              const Icon = display.icon;
              return (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'oklch(0.65 0.02 255)' }}>
                    {user.role === 'MANAGER' ? 'Manager' : 'Member'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{
                      background: display.bg, color: display.color
                    }}>
                      <Icon className="w-3 h-3" />
                      {display.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
