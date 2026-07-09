import Sidebar from '@/components/layout/Sidebar';
import ChatWidget from '@/components/ai/ChatWidget';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: 'oklch(0.13 0.018 255)' }}>
      <Sidebar />
      <main className="flex-1 md:ml-60 pt-16 md:pt-0 min-h-screen max-w-full overflow-x-hidden">
        {children}
      </main>
      <ChatWidget />
    </div>
  );
}
