'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Report, User, Project } from '@/lib/types';
import { getDashboardReports } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Filter, Loader2, Calendar } from 'lucide-react';
import ReportCard from '@/components/reports/ReportCard';

interface ReportsTableProps {
  users: User[];
  projects: Project[];
}

export default function ReportsTable({ users, projects }: ReportsTableProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [userId, setUserId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getDashboardReports({
        userId: userId || undefined,
        projectId: projectId || undefined,
        weekStart: weekStart || undefined,
        weekEnd: weekEnd || undefined
      });
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [userId, projectId, weekStart, weekEnd]);

  const inputStyle = { background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' };

  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
        <div className="flex items-center gap-2 mb-6">
          <Filter className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">Filter Reports</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Team Member</label>
            <select
              value={userId}
              onChange={e => setUserId(e.target.value)}
              className="w-full h-9 rounded-md px-2.5 text-sm"
              style={{ ...inputStyle, border: '1px solid oklch(1 0 0 / 12%)' }}
            >
              <option value="">All Members</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Project</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full h-9 rounded-md px-2.5 text-sm"
              style={{ ...inputStyle, border: '1px solid oklch(1 0 0 / 12%)' }}
            >
              <option value="">All Projects</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>From Date</label>
            <Input type="date" value={weekStart} onChange={e => setWeekStart(e.target.value)} style={inputStyle} className="[color-scheme:dark]" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>To Date</label>
            <Input type="date" value={weekEnd} onChange={e => setWeekEnd(e.target.value)} style={inputStyle} className="[color-scheme:dark]" />
          </div>
        </div>
      </div>

      <div className="relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'oklch(0.585 0.207 264)' }} />
          </div>
        )}
        
        {reports.length === 0 && !loading ? (
          <div className="text-center py-16 rounded-2xl" style={{ border: '1px dashed oklch(1 0 0 / 15%)' }}>
            <Calendar className="w-8 h-8 mx-auto mb-3 opacity-50" style={{ color: 'oklch(0.65 0.02 255)' }} />
            <p className="text-lg text-white mb-1">No reports found</p>
            <p className="text-sm" style={{ color: 'oklch(0.65 0.02 255)' }}>Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reports.map(r => (
              <ReportCard key={r.id} report={r} onView={(id) => router.push(`/dashboard/reports/${id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
