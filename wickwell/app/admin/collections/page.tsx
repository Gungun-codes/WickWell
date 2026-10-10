// FILE PATH: wickwell/app/admin/collections/page.tsx  (replace/create this file in your project)
"use client";
import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { revalidateStore } from "../actions";

type Row = { id: string; slug: string; name: string; image_id: string | null; sort_order: number; dirty?: boolean };
type Table = "categories" | "occasions";

const input = "w-full rounded-md border border-cocoa-900/15 bg-white px-4 py-3 text-base outline-none focus:border-wine-600 md:text-sm";
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function Manager({ table, title, hint }: { table: Table; title: string; hint: string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [newName, setNewName] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from(table).select("id, slug, name, image_id, sort_order").order("sort_order");
    if (error) setMsg({ type: "err", text: error.message });
    setRows((data as Row[]) ?? []);
  }, [table]);
  useEffect(() => { load(); }, [load]);

  const patch = (id: string, p: Partial<Row>) => setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, ...p, dirty: true } : r)) ?? null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim(); const slug = slugify(name);
    if (!slug) return setMsg({ type: "err", text: "Type a name first." });
    setBusy("new"); setMsg(null);
    const next = Math.max(0, ...(rows ?? []).map((r) => r.sort_order)) + 1;
    const { error } = await supabase.from(table).insert({ name, slug, sort_order: next });
    setBusy(null);
    if (error) return setMsg({ type: "err", text: error.code === "23505" ? "That name already exists." : error.message });
    setNewName(""); await revalidateStore(); load();
    setMsg({ type: "ok", text: `Added "${name}".` });
  }

  async function save(r: Row) {
    if (!r.name.trim()) return setMsg({ type: "err", text: "Name cannot be empty." });
    setBusy(r.id); setMsg(null);
    const { error } = await supabase.from(table).update({ name: r.name.trim(), image_id: r.image_id, sort_order: r.sort_order }).eq("id", r.id);
    setBusy(null);
    if (error) return setMsg({ type: "err", text: error.message });
    await revalidateStore(); load();
    setMsg({ type: "ok", text: `Saved "${r.name}".` });
  }

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.name}"?\n\nProducts are not deleted. They just stop being listed under it.`)) return;
    setBusy(r.id);
    const { error } = await supabase.from(table).delete().eq("id", r.id);
    setBusy(null);
    if (error) return setMsg({ type: "err", text: error.message });
    await revalidateStore(); load();
  }

  return (
    <section className="rounded-card bg-cream-50 p-5 shadow-soft">
      <h2 className="text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-cocoa-600">{hint}</p>

      <form onSubmit={add} className="mt-4 flex gap-2">
        <label htmlFor={`new-${table}`} className="sr-only">New name</label>
        <input id={`new-${table}`} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={table === "categories" ? "e.g. Diwali Special" : "e.g. Anniversary"} className={input} />
        <button disabled={busy === "new"} className="btn-primary min-h-12 shrink-0 px-5 disabled:opacity-60"><Plus size={18} aria-hidden /> Add</button>
      </form>
      {msg && <p role="status" className={`mt-3 text-sm ${msg.type === "err" ? "text-wine-700" : "text-green-800"}`}>{msg.text}</p>}

      {rows === null ? <p className="mt-4 text-cocoa-600">Loading…</p> : (
        <ul className="mt-5 space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="rounded-lg border border-cocoa-900/10 bg-white/60 p-4">
              <div className="grid grid-cols-[1fr_5.5rem] gap-2">
                <div>
                  <label className="mb-1 block text-xs text-cocoa-600">Name</label>
                  <input value={r.name} onChange={(e) => patch(r.id, { name: e.target.value })} className={input} aria-label="Name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-cocoa-600">Order</label>
                  <input value={r.sort_order} inputMode="numeric" onChange={(e) => patch(r.id, { sort_order: parseInt(e.target.value || "0", 10) || 0 })} className={input} aria-label="Order" />
                </div>
              </div>
              <p className="mt-1 text-xs text-cocoa-600">Link: /shop?{table === "categories" ? "category" : "occasion"}={r.slug}</p>
              <div className="mt-3">
                <ImageUploader max={1} value={r.image_id ? [r.image_id] : []} onChange={(ids) => patch(r.id, { image_id: ids[0] ?? null })} />
              </div>
              <div className="mt-3 flex gap-2">
                <button disabled={!r.dirty || busy === r.id} onClick={() => save(r)} className="btn-primary min-h-11 px-6 text-sm disabled:opacity-40">{busy === r.id ? "Saving…" : "Save"}</button>
                <button onClick={() => remove(r)} aria-label={`Delete ${r.name}`} className="grid size-11 place-items-center rounded-md border border-cocoa-900/15 text-cocoa-600 hover:text-wine-600"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function AdminCollections() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-4xl sm:text-5xl">Categories &amp; occasions</h1>
      <p className="max-w-xl text-sm text-cocoa-600">
        These are the "Shop by category" and "Shop by occasion" tiles on your home page and the filters on the shop page.
        Add a photo to each tile, or leave it empty to show a coloured tile with the name. To put a candle under one, tick it on the product page.
      </p>
      <Manager table="categories" title="Shop by category" hint="Festive, Party, Halloween, Love, Secret Message, Hamper / Gift, Premium Candle." />
      <Manager table="occasions" title="Shop by occasion" hint="Festive, Love, Halloween, Party. Delete any older ones you do not need." />
    </div>
  );
}