import { Home, AlertCircle, Archive, Layers } from 'lucide-react';
import type { Listing } from '../lib/supabase';

interface Props {
  listings: Listing[];
}

export default function StatsDashboard({ listings }: Props) {
  const total = listings.length;
  const pending = listings.filter((l) => l.status === 'pending_check').length;
  const archived = listings.filter((l) => l.status === 'sold').length;
  const available = listings.filter((l) => l.status === 'available').length;

  const stats = [
    { label: 'Total Listings', value: total, Icon: Layers, accent: 'text-sky-600', bg: 'bg-sky-50', ring: 'ring-sky-200' },
    { label: 'Available', value: available, Icon: Home, accent: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200' },
    { label: 'Pending Verification', value: pending, Icon: AlertCircle, accent: 'text-amber-600', bg: 'bg-amber-50', ring: 'ring-amber-200' },
    { label: 'Recently Archived', value: archived, Icon: Archive, accent: 'text-slate-600', bg: 'bg-slate-100', ring: 'ring-slate-300' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-2xl ${s.bg} ring-1 ${s.ring} p-5 transition-transform duration-200 hover:-translate-y-0.5`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${s.accent}`}>{s.value}</span>
            <s.Icon className={`h-7 w-7 ${s.accent} opacity-80`} />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-600">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
