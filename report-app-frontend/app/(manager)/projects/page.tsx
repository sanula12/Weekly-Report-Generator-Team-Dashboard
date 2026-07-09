'use client';
import { useEffect, useState } from 'react';
import { getProjects, createProject, deleteProject } from '@/lib/api';
import { Project } from '@/lib/types';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const load = () => getProjects().then(setProjects).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await createProject({ name, description: desc });
    setName(''); setDesc('');
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await deleteProject(id);
      load();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
        <p style={{ color: 'oklch(0.65 0.02 255)' }}>Manage categories for team reports.</p>
      </div>

      <div className="rounded-2xl p-6" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
        <h3 className="text-lg font-bold text-white mb-4">Add New Project</h3>
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }} />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Description</label>
            <Input value={desc} onChange={e => setDesc(e.target.value)} style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }} />
          </div>
          <Button type="submit" style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }} className="px-6">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <div key={p.id} className="rounded-xl p-5 flex justify-between items-start" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
            <div>
              <h4 className="font-bold text-white text-lg mb-1">{p.name}</h4>
              {p.description && <p className="text-sm" style={{ color: 'oklch(0.65 0.02 255)' }}>{p.description}</p>}
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'oklch(0.704 0.191 22.216)' }}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
