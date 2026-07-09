'use client';
import { useEffect, useState } from 'react';
import { getDashboardUsers } from '@/lib/api';
import { User } from '@/lib/types';
import { Shield, User as UserIcon } from 'lucide-react';

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getDashboardUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
        <p style={{ color: 'oklch(0.65 0.02 255)' }}>View all registered users in your workspace.</p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[500px]">
            <thead style={{ background: 'oklch(0.16 0.018 255)' }}>
              <tr>
                <th className="px-6 py-4 font-semibold text-white">Name</th>
                <th className="px-6 py-4 font-semibold text-white">Email</th>
                <th className="px-6 py-4 font-semibold text-white">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap" style={{ color: 'oklch(0.7 0.02 255)' }}>{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{
                      background: u.role === 'MANAGER' ? 'oklch(0.66 0.19 264 / 15%)' : 'oklch(0.7 0.02 255 / 15%)',
                      color: u.role === 'MANAGER' ? 'oklch(0.75 0.15 264)' : 'oklch(0.8 0.02 255)'
                    }}>
                      {u.role === 'MANAGER' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                      {u.role === 'MANAGER' ? 'Manager' : 'Member'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
