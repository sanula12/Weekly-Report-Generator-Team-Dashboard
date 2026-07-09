'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart3, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      saveAuth(res.data.token, res.data.role, res.data.name);
      router.push(res.data.role === 'MANAGER' ? '/dashboard' : '/reports');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: string } }).response?.data || 'Registration failed'
        : 'Registration failed';
      setError(typeof message === 'string' ? message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, oklch(0.13 0.018 255) 0%, oklch(0.18 0.035 270) 50%, oklch(0.15 0.025 280) 100%)'
    }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8 shadow-2xl" style={{
          background: 'oklch(0.185 0.018 255)',
          border: '1px solid oklch(1 0 0 / 10%)'
        }}>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.585 0.207 264)' }}>
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">TeamPulse</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">Create an account</h2>
          <p style={{ color: 'oklch(0.65 0.02 255)' }} className="text-sm mb-6">Join your team workspace</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'oklch(0.577 0.245 27.325 / 15%)', color: 'oklch(0.704 0.191 22.216)', border: '1px solid oklch(0.577 0.245 27.325 / 30%)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: 'oklch(0.8 0.01 255)' }} htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="John Smith"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }}
                className="placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'oklch(0.8 0.01 255)' }} htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }}
                className="placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'oklch(0.8 0.01 255)' }} htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }}
                className="placeholder:text-white/30"
              />
            </div>
            <div className="space-y-2">
              <Label style={{ color: 'oklch(0.8 0.01 255)' }} htmlFor="role">Role</Label>
              <select
                id="role"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                required
                className="w-full h-9 rounded-md px-2.5 text-sm text-white"
                style={{ background: 'oklch(0.22 0.02 255)', border: '1px solid oklch(1 0 0 / 12%)' }}
              >
                <option value="MEMBER">Team Member</option>
                <option value="MANAGER">Manager / Admin</option>
              </select>
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-semibold text-base mt-2"
              style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
              disabled={loading}
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'oklch(0.6 0.02 255)' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: 'oklch(0.66 0.19 264)' }} className="font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
