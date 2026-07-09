'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, BarChart3, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      saveAuth(res.data.token, res.data.role, res.data.name);
      router.push(res.data.role === 'MANAGER' ? '/dashboard' : '/reports');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, oklch(0.13 0.018 255) 0%, oklch(0.18 0.035 270) 50%, oklch(0.15 0.025 280) 100%)'
    }}>
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 text-white">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.585 0.207 264)' }}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">TeamPulse</span>
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Your team's pulse,<br />
          <span style={{ color: 'oklch(0.66 0.19 264)' }}>in one place.</span>
        </h1>
        <p className="text-lg text-white/60 max-w-md leading-relaxed">
          Submit weekly reports, track team progress, and uncover insights-all from a single, beautiful dashboard.
        </p>
        <div className="mt-12 flex gap-8">
          {[['Weekly Reports', 'Track work done'], ['Team Dashboard', 'Manager insights'], ['AI Assistant', 'Smart Q&A']].map(([title, desc]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-white mb-1">{title}</p>
              <p className="text-xs text-white/50">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8 shadow-2xl" style={{
            background: 'oklch(0.185 0.018 255)',
            border: '1px solid oklch(1 0 0 / 10%)'
          }}>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6 lg:hidden">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.585 0.207 264)' }}>
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">TeamPulse</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p style={{ color: 'oklch(0.65 0.02 255)' }} className="text-sm">Sign in to your workspace</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'oklch(0.577 0.245 27.325 / 15%)', color: 'oklch(0.704 0.191 22.216)', border: '1px solid oklch(0.577 0.245 27.325 / 30%)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }}
                    className="placeholder:text-white/30 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 font-semibold text-base"
                style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
                disabled={loading}
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: 'oklch(0.6 0.02 255)' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: 'oklch(0.66 0.19 264)' }} className="font-medium hover:underline">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}