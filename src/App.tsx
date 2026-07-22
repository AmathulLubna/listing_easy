import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Loader2, Zap, Building2 } from 'lucide-react';
import { supabase, type Listing } from './lib/supabase';
import { isStale } from './lib/freshness';
import StatsDashboard from './components/StatsDashboard';
import ListingCard from './components/ListingCard';
import AddListingForm from './components/AddListingForm';

type Filter = 'all' | 'available' | 'pending_check' | 'sold';

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('posted_at', { ascending: false });
    if (!error && data) setListings(data as Listing[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Simulated cron job: scans every listing and flags stale ones as pending_check.
  // A listing is stale if posted_at is older than 7 days OR view_count > 10.
  async function runCronScan() {
    setScanning(true);
    setScanResult(null);
    let flagged = 0;
    const now = new Date().toISOString();
    const toFlag = listings.filter((l) => l.status === 'available' && isStale(l));

    for (const listing of toFlag) {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'pending_check', last_checked_at: now })
        .eq('id', listing.id);
      if (!error) flagged += 1;
    }

    setScanning(false);
    setScanResult(
      flagged === 0
        ? 'Scan complete — all listings are fresh.'
        : `Scan complete — ${flagged} listing${flagged === 1 ? '' : 's'} flagged for verification.`,
    );
    fetchListings();
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return listings;
    return listings.filter((l) => l.status === filter);
  }, [listings, filter]);

  const filterTabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'pending_check', label: 'Pending' },
    { key: 'sold', label: 'Archived' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Listing Freshness System</h1>
              <p className="text-xs text-slate-500">Auto-verify stale property listings</p>
            </div>
          </div>
          <AddListingForm onAdded={fetchListings} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Stats */}
        <StatsDashboard listings={listings} />

        {/* Cron scan control */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-slate-900">Freshness Cron Job</h2>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Scans all listings. Flags any older than 7 days or with 10+ views for owner verification.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {scanResult && (
                <span className="text-xs font-medium text-slate-600">{scanResult}</span>
              )}
              <button
                onClick={runCronScan}
                disabled={scanning || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-60"
              >
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Run Freshness Scan
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-12 text-center ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">No listings in this category yet.</p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onUpdate={fetchListings} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        Listing Freshness System MVP — data persists in Supabase
      </footer>
    </div>
  );
}
