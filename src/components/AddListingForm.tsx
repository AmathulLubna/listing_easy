import { useState } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { supabase, type ListingInsert } from '../lib/supabase';

interface Props {
  onAdded: () => void;
}

const EMPTY = {
  title: '',
  description: '',
  price: '',
  owner_phone: '',
  image_url: '',
};

export default function AddListingForm({ onAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const price = Number(form.price);
    if (!form.title || !form.description || !form.price || !form.owner_phone) {
      setError('Please fill in title, description, price, and owner phone.');
      return;
    }
    if (Number.isNaN(price) || price <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    const payload: ListingInsert = {
      title: form.title,
      description: form.description,
      price,
      owner_phone: form.owner_phone,
      image_url: form.image_url || null,
      posted_at: new Date().toISOString(),
      view_count: 0,
      status: 'available',
    };

    setSaving(true);
    const { error: insertError } = await supabase.from('listings').insert(payload);
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setForm(EMPTY);
    setOpen(false);
    onAdded();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 hover:shadow"
      >
        <Plus className="h-4 w-4" />
        Add Listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !saving && setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Add New Listing</h2>
              <button
                onClick={() => setOpen(false)}
                disabled={saving}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Field label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. 2BHK in Shamshabad"
                  className="input"
                />
              </Field>
              <Field label="Description" required>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  placeholder="Short description of the property"
                  className="input resize-none"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (INR/month)" required>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => update('price', e.target.value)}
                    placeholder="18000"
                    className="input"
                  />
                </Field>
                <Field label="Owner Phone" required>
                  <input
                    value={form.owner_phone}
                    onChange={(e) => update('owner_phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="input"
                  />
                </Field>
              </div>
              <Field label="Image URL (optional)">
                <input
                  value={form.image_url}
                  onChange={(e) => update('image_url', e.target.value)}
                  placeholder="https://images.pexels.com/..."
                  className="input"
                />
              </Field>

              {error && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={saving}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Save Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
