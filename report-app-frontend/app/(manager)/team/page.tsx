'use client';
import { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '@/lib/api';
import { User } from '@/lib/types';
import { Shield, User as UserIcon, Search, ChevronLeft, ChevronRight, FileEdit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  
  // Pagination & Filter state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  
  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');

  const load = () => {
    getUsers({ page, size: 6, search: search || undefined, role: role || undefined })
      .then(res => {
        if (Array.isArray(res)) {
          setUsers(res);
          setTotalPages(1);
        } else {
          setUsers(res?.content || []);
          setTotalPages(res?.totalPages || 1);
        }
      })
      .catch(console.error);
  };

  useEffect(() => { load(); }, [page, search, role]);

  const handleDelete = async (id: string) => {
    if (window.confirm('WARNING: Are you sure you want to delete this Team Member? ALL of their submitted weekly reports will also be permanently deleted!')) {
      await deleteUser(id);
      load();
    }
  };

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateUser(editingId, { name: editName, email: editEmail, role: editRole });
    setEditingId(null);
    load();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Team Members</h1>
        <p style={{ color: 'oklch(0.65 0.02 255)' }}>Manage all registered users in your workspace.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
          <Input 
            placeholder="Search by name or email..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 bg-black/20 border-white/10 text-white" 
          />
        </div>
        <select
          value={role}
          onChange={e => { setRole(e.target.value); setPage(0); }}
          className="h-10 rounded-md px-3 text-sm bg-black/20 border border-white/10 text-white min-w-[150px]"
        >
          <option value="">All Roles</option>
          <option value="MANAGER">Manager</option>
          <option value="MEMBER">Member</option>
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[600px]">
            <thead style={{ background: 'oklch(0.16 0.018 255)' }}>
              <tr>
                <th className="px-6 py-4 font-semibold text-white">Name</th>
                <th className="px-6 py-4 font-semibold text-white">Email</th>
                <th className="px-6 py-4 font-semibold text-white">Role</th>
                <th className="px-6 py-4 font-semibold text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-white/50">No users found.</td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  {editingId === u.id ? (
                    <>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8 text-sm bg-black/20 border-white/10 text-white w-full max-w-[200px]" />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="h-8 text-sm bg-black/20 border-white/10 text-white w-full max-w-[200px]" />
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <select value={editRole} onChange={e => setEditRole(e.target.value)} className="h-8 rounded text-sm bg-black/20 border border-white/10 text-white px-2">
                          <option value="MANAGER">Manager</option>
                          <option value="MEMBER">Member</option>
                        </select>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingId(null)} className="px-3 py-1 rounded text-xs" style={{ color: 'oklch(0.65 0.02 255)' }}>Cancel</button>
                          <button onClick={saveEdit} className="px-3 py-1 rounded text-xs font-bold" style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}>Save</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => startEdit(u)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'oklch(0.65 0.02 255)' }} title="Edit User">
                            <FileEdit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'oklch(0.704 0.191 22.216)' }} title="Delete User">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center pt-2">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg bg-black/20 text-white disabled:opacity-50 hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/70">Page {page + 1} of {totalPages}</span>
          <button 
            disabled={page >= totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg bg-black/20 text-white disabled:opacity-50 hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
