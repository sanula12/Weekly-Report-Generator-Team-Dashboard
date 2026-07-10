'use client';
import { useEffect, useState } from 'react';
import { getPaginatedProjects, createProject, deleteProject, updateProject } from '@/lib/api';
import { Project } from '@/lib/types';
import { Plus, Trash2, FileEdit, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  
  // Pagination & Filter state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const load = () => {
    getPaginatedProjects({ page, size: 6, search: search || undefined })
      .then(res => {
        // If the backend isn't restarted, it might return a flat array instead of a Page object
        if (Array.isArray(res)) {
          setProjects(res);
          setTotalPages(1);
        } else {
          setProjects(res?.content || []);
          setTotalPages(res?.totalPages || 1);
        }
      })
      .catch(console.error);
  };
  
  useEffect(() => { load(); }, [page, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await createProject({ name, description: desc });
    setName(''); setDesc('');
    setPage(0); // Go back to first page to see new project
    load();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('WARNING: Are you sure you want to delete this project? Any existing reports tagged with this project will lose their project tag (but the reports themselves will NOT be deleted).')) {
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
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap sm:flex-nowrap">
          <div className="flex-1 space-y-2 min-w-[200px]">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }} />
          </div>
          <div className="flex-1 space-y-2 min-w-[200px]">
            <label className="text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Description</label>
            <Input value={desc} onChange={e => setDesc(e.target.value)} style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }} />
          </div>
          <Button type="submit" style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }} className="px-6 h-10 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
          <Input 
            placeholder="Search projects by name..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 bg-black/20 border-white/10 text-white" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <p className="text-white/50 py-4 col-span-2 text-center">No projects found.</p>
        ) : (
          projects.map(p => (
            <ProjectCard key={p.id} project={p} onDelete={handleDelete} onUpdate={load} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 items-center pt-4">
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

function ProjectCard({ project, onDelete, onUpdate }: { project: Project, onDelete: (id: string) => void, onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [desc, setDesc] = useState(project.description || '');

  const handleSave = async () => {
    if (!name) return;
    await updateProject(project.id, { name, description: desc });
    setIsEditing(false);
    onUpdate();
  };

  if (isEditing) {
    return (
      <div className="rounded-xl p-5" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(0.585 0.207 264)' }}>
        <div className="space-y-3 mb-4">
          <Input value={name} onChange={e => setName(e.target.value)} className="h-8 text-sm" style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }} />
          <Input value={desc} onChange={e => setDesc(e.target.value)} className="h-8 text-sm" placeholder="Description" style={{ background: 'oklch(0.22 0.02 255)', borderColor: 'oklch(1 0 0 / 12%)', color: 'white' }} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>Cancel</button>
          <button onClick={handleSave} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}>Save</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-5 flex justify-between items-start group" style={{ background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 8%)' }}>
      <div>
        <h4 className="font-bold text-white text-lg mb-1">{project.name}</h4>
        {project.description && <p className="text-sm" style={{ color: 'oklch(0.65 0.02 255)' }}>{project.description}</p>}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'oklch(0.65 0.02 255)' }}>
          <FileEdit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(project.id)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: 'oklch(0.704 0.191 22.216)' }}>
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
