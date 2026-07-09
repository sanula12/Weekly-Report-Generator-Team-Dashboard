'use client';
import { useEffect, useState } from 'react';
import { getDashboardMetrics, getDashboardActivity, getDashboardReports, getDashboardUsers, getProjects } from '@/lib/api';
import { Metrics, Report, User, Project } from '@/lib/types';
import MetricCard from '@/components/dashboard/MetricCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import MemberStatusTable from '@/components/dashboard/MemberStatusTable';
import ReportsTable from '@/components/dashboard/ReportsTable';
import { FileText, CheckCircle2, TrendingUp, AlertOctagon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [activity, setActivity] = useState<Report[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getDashboardMetrics().then(setMetrics).catch(console.error);
    getDashboardActivity(10).then(setActivity).catch(console.error);
    getDashboardReports().then(setReports).catch(console.error);
    getDashboardUsers().then(setUsers).catch(console.error);
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const pieData = [
    { name: 'Submitted', value: metrics?.submittedThisWeek || 0, color: 'oklch(0.66 0.19 264)' },
    { name: 'Draft', value: (metrics?.totalThisWeek || 0) - (metrics?.submittedThisWeek || 0), color: 'oklch(0.26 0.04 264)' }
  ];

  const barData = reports.reduce((acc: any[], r) => {
    if (!r.project) return acc;
    const existing = acc.find(x => x.name === r.project!.name);
    if (existing) existing.hours += r.hoursWorked || 0;
    else acc.push({ name: r.project.name, hours: r.hoursWorked || 0 });
    return acc;
  }, []).sort((a, b) => b.hours - a.hours).slice(0, 5);

  // Approximate tasks completed by counting non-empty lines in tasksCompleted
  const trendData = reports.reduce((acc: any[], r) => {
    const week = r.weekStart;
    const taskCount = r.tasksCompleted.split('\n').filter(l => l.trim().length > 0).length;
    const existing = acc.find(x => x.week === week);
    if (existing) existing.tasks += taskCount;
    else acc.push({ week, tasks: taskCount });
    return acc;
  }, []).sort((a, b) => a.week.localeCompare(b.week));

  // For the MemberStatusTable, we only want to show status for the *current week*
  // We'll estimate the current week as the weekStart of the most recent report, or just use the last 7 days.
  const thisWeekReports = reports.filter(r => {
    const reportDate = new Date(r.weekStart);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - reportDate.getTime());
    return diffTime <= 7 * 24 * 60 * 60 * 1000;
  });

  const chartTheme = {
    grid: 'oklch(1 0 0 / 10%)',
    axis: 'oklch(0.65 0.02 255)',
    tooltip: { background: 'oklch(0.16 0.018 255)', border: '1px solid oklch(1 0 0 / 10%)', borderRadius: '8px' }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Manager Dashboard</h1>
        <p style={{ color: 'oklch(0.65 0.02 255)' }}>Overview of team performance and reports.</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Reports (Week)" value={metrics.totalThisWeek} icon={FileText} />
          <MetricCard title="Submitted (Week)" value={metrics.submittedThisWeek} icon={CheckCircle2} />
          <MetricCard title="Compliance Rate" value={`${metrics.complianceRate}%`} icon={TrendingUp} trendUp={metrics.complianceRate >= 80} trend={metrics.complianceRate >= 80 ? 'Good' : 'Needs attention'} />
          <MetricCard title="Open Blockers" value={metrics.openBlockers} icon={AlertOctagon} trendUp={metrics.openBlockers === 0} trend={metrics.openBlockers > 0 ? 'Action required' : 'All clear'} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
              <h3 className="text-lg font-bold text-white mb-6">Tasks Completed Trend</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                    <XAxis dataKey="week" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: 'oklch(1 0 0 / 5%)' }} contentStyle={chartTheme.tooltip} />
                    <Line type="monotone" dataKey="tasks" stroke="oklch(0.66 0.19 264)" strokeWidth={3} dot={{ r: 4, fill: 'oklch(0.66 0.19 264)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
              <h3 className="text-lg font-bold text-white mb-6">Report Completion (This Week)</h3>
              <div className="h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                    </Pie>
                    <RechartsTooltip contentStyle={chartTheme.tooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
            <h3 className="text-lg font-bold text-white mb-6">Hours by Project</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="name" stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axis} fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: 'oklch(1 0 0 / 5%)' }} contentStyle={chartTheme.tooltip} />
                  <Bar dataKey="hours" fill="oklch(0.66 0.19 264)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Member Status Table */}
          <MemberStatusTable users={users} reports={thisWeekReports} />
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
            <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
            <ActivityFeed activities={activity} />
          </div>
        </div>
      </div>

      <div className="pt-8">
        <h2 className="text-2xl font-bold text-white mb-6">All Team Reports</h2>
        <ReportsTable users={users} projects={projects} />
      </div>
    </div>
  );
}