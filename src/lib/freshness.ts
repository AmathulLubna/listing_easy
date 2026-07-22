import type { Listing } from './supabase';

// Freshness rules — the core "cron" logic.
// A listing is flagged for owner verification when EITHER:
//   1. TIME TRIGGER: it has been posted for more than 7 days, OR
//   2. TRAFFIC TRIGGER: it has received more than 10 views.
// Once flagged, status becomes "pending_check" until the owner replies.
export const STALE_AGE_DAYS = 7;
export const STALE_VIEW_THRESHOLD = 10;

export function daysSince(isoDate: string): number {
  const posted = new Date(isoDate).getTime();
  return (Date.now() - posted) / (1000 * 60 * 60 * 24);
}

export function isStale(listing: Listing): boolean {
  const tooOld = daysSince(listing.posted_at) > STALE_AGE_DAYS;
  const tooManyViews = listing.view_count > STALE_VIEW_THRESHOLD;
  return tooOld || tooManyViews;
}

export function staleReason(listing: Listing): string {
  const tooOld = daysSince(listing.posted_at) > STALE_AGE_DAYS;
  const tooManyViews = listing.view_count > STALE_VIEW_THRESHOLD;
  if (tooOld && tooManyViews) return 'Older than 7 days and 10+ views';
  if (tooOld) return `Older than ${STALE_AGE_DAYS} days`;
  if (tooManyViews) return `${STALE_VIEW_THRESHOLD}+ views`;
  return 'Fresh';
}
