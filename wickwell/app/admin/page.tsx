// FILE PATH: wickwell/app/admin/page.tsx  (replace/create this file in your project)
"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cld } from "@/lib/cloudinary";
import { rupees } from "@/lib/format";
import { revalidateStore } from "./actions";

type Row = {
  id: string; slug: string; name: string; image_ids: string[]; image_url: string | null; is_active: boolean; is_bestseller: boolean;
  variants: { price_paise: number; stock: number }[];
};

export default function AdminProducts() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, image_ids, image_url, is_active, is_bestseller, variants(price_paise, stock)")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setRows((data as Row[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function toggle(r: Row) {
    const { error } = await supabase.from("products").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) { setError(error.message); return; }
    await revalidateStore();
    load();
  }

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.name}" permanently?\n\nIts sizes, reviews and cart entries are deleted too. Past orders keep their record. If you only want to stop selling it, use Hide instead.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", r.id);
    if (error) { setError(error.message); return; }
    await revalidateStore();
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-4xl sm:text-5xl">Products</h1>
        <Link href="/admin/products/new" className="btn-primary min-h-12 shrink-0"><Plus size={18} aria-hidden /> New product</Link>
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-wine-700">{error}</p>}

      {rows === null ? (
        <p className="mt-8 text-cocoa-600">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-cocoa-600">No products yet. Add your first candle.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => {
            const prices = r.variants.map((v) => v.price_paise);
            const stock = r.variants.reduce((n, v) => n + v.stock, 0);
            return (
              <li key={r.id} className="flex gap-3 rounded-card bg-cream-50 p-3 shadow-soft">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image_url?.trim() || (r.image_ids[0] ? cld(r.image_ids[0], 200) : `/${r.slug}.png`)} alt="" className="size-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{r.name}</p>
                  <p className="text-sm text-cocoa-600">
                    {prices.length ? `from ${rupees(Math.min(...prices))}` : "No sizes"} · {stock} in stock
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                    <span className={`rounded-full px-2 py-0.5 ${r.is_active ? "bg-green-600/15 text-green-800" : "bg-cocoa-900/10 text-cocoa-600"}`}>{r.is_active ? "Live" : "Hidden"}</span>
                    {r.is_bestseller && <span className="rounded-full bg-gold-400/25 px-2 py-0.5">Best seller</span>}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Link href={`/admin/products/${r.id}`} className="btn-ghost min-h-10 px-4 text-sm">Edit</Link>
                    <button onClick={() => toggle(r)} className="btn-ghost min-h-10 px-4 text-sm">{r.is_active ? "Hide" : "Show"}</button>
                    <button onClick={() => remove(r)} className="btn-ghost min-h-10 px-4 text-sm text-wine-700">Delete</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}