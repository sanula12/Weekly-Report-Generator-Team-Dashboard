'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProjects } from '@/lib/api';
import { Project, Report } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Send } from 'lucide-react';

interface ReportFormProps {
  initialData?: Partial<Report>;
  onSaveDraft: (data: object) => Promise<void>;
  onSubmit: (data: object) => Promise<void>;
  isEdit?: boolean;
}

export default function ReportForm({ initialData, onSaveDraft, onSubmit, isEdit }: ReportFormProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    weekStart: initialData?.weekStart || '',
    weekEnd: initialData?.weekEnd || '',
    projectId: initialData?.project?.id || '',
    tasksCompleted: initialData?.tasksCompleted || '',
    tasksPlanned: initialData?.tasksPlanned || '',
    blockers: initialData?.blockers || '',
    hoursWorked: initialData?.hoursWorked?.toString() || '',
    notes: initialData?.notes || '',
  });

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const buildPayload = () => ({
    weekStart: form.weekStart,
    weekEnd: form.weekEnd,
    projectId: form.projectId || null,
    tasksCompleted: form.tasksCompleted,
    tasksPlanned: form.tasksPlanned,
    blockers: form.blockers || null,
    hoursWorked: form.hoursWorked ? parseInt(form.hoursWorked) : null,
    notes: form.notes || null,
  });

  const handleSaveDraft = async () => {
    setLoading(true); setError('');
    try { await onSaveDraft(buildPayload()); router.push('/reports'); }
    catch (e: unknown) { setError('Failed to save. Please try again.'); console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try { await onSubmit(buildPayload()); router.push('/reports'); }
    catch (e: unknown) { setError('Failed to submit. Please try again.'); console.error(e); }
    finally { setLoading(false); }
  };

  const inputStyle = { background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' };
  const labelStyle = { color: 'oklch(0.75 0.01 255)' };
  const sectionStyle = { background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ background: 'oklch(0.577 0.245 27.325 / 15%)', color: 'oklch(0.704 0.191 22.216)', border: '1px solid oklch(0.577 0.245 27.325 / 30%)' }}>
          {error}
        </div>
      )}

      {/* Week & Project */}
      <div className="rounded-xl p-6" style={sectionStyle}>
        <h3 className="text-sm font-semibold text-white mb-4">Week Details</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label style={labelStyle} htmlFor="weekStart">Week Start</Label>
            <Input id="weekStart" type="date" value={form.weekStart} onChange={e => set('weekStart', e.target.value)} required style={inputStyle} className="[color-scheme:dark]" />
          </div>
          <div className="space-y-2">
            <Label style={labelStyle} htmlFor="weekEnd">Week End</Label>
            <Input id="weekEnd" type="date" value={form.weekEnd} onChange={e => set('weekEnd', e.target.value)} required style={inputStyle} className="[color-scheme:dark]" />
          </div>
        </div>
        <div className="space-y-2">
          <Label style={labelStyle} htmlFor="project">Project / Category</Label>
          <select
            id="project"
            value={form.projectId}
            onChange={e => set('projectId', e.target.value)}
            className="w-full h-9 rounded-md px-2.5 text-sm"
            style={{ ...inputStyle, border: '1px solid oklch(1 0 0 / 12%)' }}
          >
            <option value="">No project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Tasks */}
      <div className="rounded-xl p-6" style={sectionStyle}>
        <h3 className="text-sm font-semibold text-white mb-4">Work Summary</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label style={labelStyle} htmlFor="tasksCompleted">Tasks Completed <span style={{ color: 'oklch(0.66 0.19 264)' }}>*</span></Label>
            <textarea
              id="tasksCompleted"
              value={form.tasksCompleted}
              onChange={e => set('tasksCompleted', e.target.value)}
              required
              rows={4}
              placeholder="Describe the tasks you completed this week..."
              className="w-full rounded-md px-3 py-2 text-sm resize-none placeholder:text-white/30 focus:outline-none"
              style={{ ...inputStyle, border: '1px solid oklch(1 0 0 / 12%)' }}
            />
          </div>
          <div className="space-y-2">
            <Label style={labelStyle} htmlFor="tasksPlanned">Tasks Planned for Next Week <span style={{ color: 'oklch(0.66 0.19 264)' }}>*</span></Label>
            <textarea
              id="tasksPlanned"
              value={form.tasksPlanned}
              onChange={e => set('tasksPlanned', e.target.value)}
              required
              rows={4}
              placeholder="What are you planning to work on next week..."
              className="w-full rounded-md px-3 py-2 text-sm resize-none placeholder:text-white/30 focus:outline-none"
              style={{ ...inputStyle, border: '1px solid oklch(1 0 0 / 12%)' }}
            />
          </div>
        </div>
      </div>

      {/* Blockers & Hours */}
      <div className="rounded-xl p-6" style={sectionStyle}>
        <h3 className="text-sm font-semibold text-white mb-4">Additional Info</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label style={labelStyle} htmlFor="blockers">Blockers / Challenges</Label>
            <textarea
              id="blockers"
              value={form.blockers}
              onChange={e => set('blockers', e.target.value)}
              rows={3}
              placeholder="Any blockers or challenges you faced? (optional)"
              className="w-full rounded-md px-3 py-2 text-sm resize-none placeholder:text-white/30 focus:outline-none"
              style={{ ...inputStyle, border: '1px solid oklch(1 0 0 / 12%)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label style={labelStyle} htmlFor="hoursWorked">Hours Worked</Label>
              <Input id="hoursWorked" type="number" min="0" max="168" value={form.hoursWorked} onChange={e => set('hoursWorked', e.target.value)} placeholder="40" style={inputStyle} />
            </div>
            <div className="space-y-2">
              <Label style={labelStyle} htmlFor="notes">Notes / Links</Label>
              <Input id="notes" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional notes..." style={inputStyle} className="placeholder:text-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: 'oklch(0.6 0.02 255)', border: '1px solid oklch(1 0 0 / 10%)' }}
        >
          Cancel
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: 'oklch(0.75 0.02 255)', border: '1px solid oklch(1 0 0 / 10%)' }}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.weekStart || !form.weekEnd || !form.tasksCompleted || !form.tasksPlanned}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-40"
            style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isEdit ? 'Save & Submit' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
