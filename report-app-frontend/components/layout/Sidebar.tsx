'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3, FileText, FolderOpen, Users, LogOut, LayoutDashboard, MessageSquare, Menu, X
} from 'lucide-react';
import { logout, getName, getRole } from '@/lib/auth';
import { cn } from '@/lib/utils';

const memberNav = [
  { href: '/reports', label: 'My Reports', icon: FileText },
];

const managerNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/team', label: 'Team', icon: Users },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState('User');
  const [role, setRole] = useState('MEMBER');
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setName(getName() || 'User');
    setRole(getRole() || 'MEMBER');
    setMounted(true);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = role === 'MANAGER' ? managerNav : memberNav;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  if (!mounted) {
    return (
      <aside className="fixed inset-y-0 left-0 z-50 w-60 hidden md:flex flex-col" style={{
        background: 'oklch(0.16 0.018 255)',
        borderRight: '1px solid oklch(1 0 0 / 8%)'
      }} />
    );
  }

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-5" style={{ background: 'oklch(0.16 0.018 255)', borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'oklch(0.585 0.207 264)' }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">TeamPulse</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 -mr-2">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-60 flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )} style={{
        background: 'oklch(0.16 0.018 255)',
        borderRight: '1px solid oklch(1 0 0 / 8%)'
      }}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 hidden md:flex" style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'oklch(0.585 0.207 264)' }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">TeamPulse</p>
            <p className="text-xs mt-0.5" style={{ color: 'oklch(0.65 0.02 255)' }}>
              {role === 'MANAGER' ? 'Manager view' : 'Member view'}
            </p>
          </div>
        </div>
        
        {/* Mobile Spacing */}
        <div className="h-16 md:hidden" />

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'text-white'
                    : 'hover:bg-white/5'
                )}
                style={active ? {
                  background: 'oklch(0.585 0.207 264 / 20%)',
                  color: 'oklch(0.8 0.15 264)',
                } : { color: 'oklch(0.65 0.02 255)' }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.66 0.19 264)' }} />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'oklch(0.585 0.207 264)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{name}</p>
              <p className="text-xs truncate" style={{ color: 'oklch(0.55 0.02 255)' }}>
                {role === 'MANAGER' ? 'Manager' : 'Team Member'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-white/5"
            style={{ color: 'oklch(0.6 0.02 255)' }}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
