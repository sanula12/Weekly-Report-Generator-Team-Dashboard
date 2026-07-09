import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export default function MetricCard({ title, value, icon: Icon, trend, trendUp }: MetricCardProps) {
  return (
    <div className="rounded-2xl p-6" style={{
      background: 'oklch(0.185 0.018 255)',
      border: '1px solid oklch(1 0 0 / 8%)'
    }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium" style={{ color: 'oklch(0.65 0.02 255)' }}>{title}</h3>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'oklch(0.585 0.207 264 / 20%)' }}>
          <Icon className="w-5 h-5" style={{ color: 'oklch(0.7 0.15 264)' }} />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trend && (
          <span className="text-sm font-medium mb-1" style={{
            color: trendUp ? 'oklch(0.7 0.2 160)' : 'oklch(0.704 0.191 22.216)'
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
