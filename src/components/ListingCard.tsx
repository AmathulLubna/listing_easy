import { useState } from 'react';
import { Phone, Eye, CalendarDays, IndianRupee, Check, X, Loader2 } from 'lucide-react';
import type { Listing } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { daysSince, staleReason, STALE_AGE_DAYS, STALE_VIEW_THRESHOLD } from '../lib/freshness';
import StatusBadge from './StatusBadge';

interface Props {
  listing: Listing;
  onUpdate: () => void;
}

export default function ListingCard({ listing, onUpdate }: Props) {
  const [replying, setReplying] = useState<'yes' | 'no' | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const ageDays = Math.floor(daysSince(listing.posted_at));
  const isPending = listing.status === 'pending_check';

  async function handleReply(reply: 'yes' | 'no') {
    setReplying(reply);
    setShowConfirm(false);
    const newStatus = reply === 'yes' ? 'available' : 'sold';
    const { error } = await supabase
      .from('listings')
      .update({ status: newStatus, last_checked_at: new Date().toISOString() })
      .eq('id', listing.id);
    setReplying(null);
    if (!error) onUpdate();
  }

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition-all duration-300 hover:shadow-lg ${
        isPending
          ? 'ring-amber-400/60 shadow-amber-100'
          : listing.status === 'sold'
          ? 'ring-slate-200 opacity-75'
          : 'ring-slate-200 hover:-translate-y-0.5'
      }`}
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold text-slate-900">{listing.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{listing.description}</p>

        <div className="mt-3 flex items-center gap-1.5 text-lg font-bold text-slate-900">
          <IndianRupee className="h-4 w-4 text-slate-500" />
          {listing.price.toLocaleString('en-IN')}
          <span className="text-xs font-normal text-slate-400">/month</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {ageDays}d ago
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {listing.view_count} views
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {listing.owner_phone.slice(-5)}
          </div>
        </div>

        {isPending && (
          <div className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
            Flagged: {staleReason(listing)}
          </div>
        )}

        <div className="mt-auto pt-4">
          {isPending ? (
            showConfirm ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleReply('yes')}
                  disabled={replying !== null}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {replying === 'yes' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Yes, still available
                </button>
                <button
                  onClick={() => handleReply('no')}
                  disabled={replying !== null}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {replying === 'no' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                  No, it's sold
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Simulate Owner Reply
              </button>
            )
          ) : (
            <div className="rounded-lg bg-slate-50 px-3 py-2 text-center text-xs font-medium text-slate-400 ring-1 ring-slate-100">
              {listing.status === 'sold'
                ? 'Archived — owner marked as sold'
                : `Auto-flag after ${STALE_AGE_DAYS} days or ${STALE_VIEW_THRESHOLD}+ views`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
