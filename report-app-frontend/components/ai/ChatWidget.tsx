'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! I can analyze team reports. Ask me anything about recent activity or blockers.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await sendChatMessage(userMsg);
      setMsgs(prev => [...prev, { role: 'bot', text: res.response }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-50"
        style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[400px] h-[550px] max-h-[80vh] rounded-2xl flex flex-col shadow-2xl z-50 overflow-hidden" style={{
          background: 'oklch(0.185 0.018 255)', border: '1px solid oklch(1 0 0 / 15%)'
        }}>
          <div className="flex items-center justify-between p-4" style={{ background: 'oklch(0.16 0.018 255)', borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.585 0.207 264 / 20%)' }}>
                <Bot className="w-5 h-5" style={{ color: 'oklch(0.7 0.15 264)' }} />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">AI Assistant</h3>
               
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/10 text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  m.role === 'user' ? 'rounded-tr-sm text-white' : 'rounded-tl-sm text-white/90'
                }`} style={{
                  background: m.role === 'user' ? 'oklch(0.585 0.207 264)' : 'oklch(0.22 0.02 255)'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-4 py-2.5" style={{ background: 'oklch(0.22 0.02 255)' }}>
                  <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="p-4" style={{ borderTop: '1px solid oklch(1 0 0 / 8%)', background: 'oklch(0.16 0.018 255)' }}>
            <form onSubmit={handleSend} className="relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about team reports..."
                className="w-full h-11 rounded-full pl-4 pr-12 text-sm focus:outline-none text-white placeholder:text-white/30"
                style={{ background: 'oklch(0.22 0.02 255)', border: '1px solid oklch(1 0 0 / 12%)' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1 top-1 w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-50"
                style={{ background: 'oklch(0.585 0.207 264)', color: 'white' }}
              >
                <Send className="w-4 h-4 mr-0.5 mt-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
