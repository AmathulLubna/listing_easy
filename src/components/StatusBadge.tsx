import { CheckCircle2, Archive, Clock, AlertCircle } from 'lucide-react';
import type { ListingStatus } from '../lib/supabase';

const STATUS_CONFIG: Record<ListingStatus, { label: string; classes: string; Icon: typeof CheckCircle2 }> = {
  available: {
    label: 'Available',
    classes: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20',
    Icon: CheckCircle2,
  },
  sold: {
    label: 'Sold',
    classes: 'bg-slate-200 text-slate-700 ring-1 ring-slate-500/20',
    Icon: Archive,
  },
  pending_check: {
    label: 'Pending Verification',
    classes: 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/30 animate-pulse',
    Icon: AlertCircle,
  },
  unverified: {
    label: 'Unverified',
    classes: 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/20',
    Icon: Clock,
  },
};

export default function StatusBadge({ status }: { status: ListingStatus }) {
  const { label, classes, Icon } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
