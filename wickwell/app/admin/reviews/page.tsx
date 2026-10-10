// FILE PATH: wickwell/app/admin/reviews/page.tsx  (replace/create this file in your project)
"use client";
import { useCallback, useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { revalidateStore } from "../actions";

type Row = {
  id: string; rating: number; title: string | null; body: string | null; reviewer_name: string | null;
  created_at: string; products: { name: string } | { name: string }[] | null;
};
const pname = (p: Row["products"]) => (Array.isArray(p) ? p[0]?.name : p?.name) ?? "";

export default function AdminReviews() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("reviews")
      .select("id, rating, title, body, reviewer_name, created_at, products(name)")
      .order("created_at", { ascending: false }).limit(100);
    if (error) setError(error.message);
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) { setError(error.message); return; }
    await revalidateStore();
    load();
  }

  return (
    <>
      <h1 className="text-4xl sm:text-5xl">Reviews</h1>
      <p className="mt-2 max-w-xl text-sm text-cocoa-600">
        Only customers who bought a candle can post a review. Delete anything abusive or off-topic here.
      </p>
      {error && <p role="alert" className="mt-4 text-sm text-wine-700">{error}</p>}
      {rows === null ? <p className="mt-8 text-cocoa-600">Loading…</p> : rows.length === 0 ? (
        <p className="mt-8 text-cocoa-600">No reviews yet.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-card bg-cream-50 p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5`}>
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={13} className="fill-gold-400 text-gold-400" />)}
                  </p>
                  {r.title && <p className="mt-1 text-sm font-medium">{r.title}</p>}
                  {r.body && <p className="mt-1 text-sm text-cocoa-600">{r.body}</p>}
                  <p className="mt-2 text-xs text-cocoa-600">{r.reviewer_name || "Customer"} · {pname(r.products)} · {new Date(r.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                </div>
                <button aria-label="Delete review" onClick={() => remove(r.id)} className="grid size-11 shrink-0 place-items-center rounded-md border border-cocoa-900/15 text-cocoa-600 hover:text-wine-600"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}