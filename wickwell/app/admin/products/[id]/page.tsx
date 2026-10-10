// FILE PATH: wickwell/app/admin/products/[id]/page.tsx  (replace/create this file in your project)
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { revalidateStore } from "../../actions";

type VariantRow = { id?: string; size: string; price: string; stock: string };
type Opt = { id: string; slug: string; name: string };

const FAMILIES = ["floral", "woody", "sweet", "fresh"];
const input = "w-full rounded-md border border-cocoa-900/15 bg-white px-4 py-3 text-base outline-none focus:border-wine-600 md:text-sm";
const label = "mb-1.5 block text-sm font-medium";
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function ProductEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [families, setFamilies] = useState<string[]>([]);
  const [burn, setBurn] = useState("50");
  const [active, setActive] = useState(true);
  const [best, setBest] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([{ size: "180g", price: "", stock: "20" }]);
  const [removedVariants, setRemovedVariants] = useState<string[]>([]);
  const [moods, setMoods] = useState<Opt[]>([]);
  const [occasions, setOccasions] = useState<Opt[]>([]);
  const [moodWeights, setMoodWeights] = useState<Record<string, number>>({});
  const [occSel, setOccSel] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const [m, o] = await Promise.all([
        supabase.from("moods").select("id, slug, name").order("sort_order"),
        supabase.from("occasions").select("id, slug, name").order("sort_order"),
      ]);
      setMoods((m.data as Opt[]) ?? []); setOccasions((o.data as Opt[]) ?? []);
      if (isNew) return;
      const { data: p } = await supabase.from("products")
        .select("*, variants(id, size_label, price_paise, stock), product_moods(mood_id, weight), product_occasions(occasion_id)")
        .eq("id", id).maybeSingle();
      if (!p) { setMsg({ type: "err", text: "Product not found." }); setLoading(false); return; }
      setName(p.name); setSlug(p.slug); setSlugTouched(true);
      setTagline(p.tagline ?? ""); setDescription(p.description ?? "");
      setNotes((p.notes ?? []).join(", ")); setFamilies(p.families ?? []);
      setBurn(String(p.burn_hours ?? "")); setActive(p.is_active); setBest(p.is_bestseller);
      setImages(p.image_ids ?? []);
      setVariants((p.variants ?? []).sort((a: any, b: any) => a.price_paise - b.price_paise).map((v: any) => ({
        id: v.id, size: v.size_label, price: String(v.price_paise / 100), stock: String(v.stock),
      })));
      setMoodWeights(Object.fromEntries((p.product_moods ?? []).map((x: any) => [x.mood_id, x.weight])));
      setOccSel((p.product_occasions ?? []).map((x: any) => x.occasion_id));
      setLoading(false);
    })();
  }, [id, isNew]);

  const setVariant = (i: number, patch: Partial<VariantRow>) =>
    setVariants((vs) => vs.map((v, j) => (j === i ? { ...v, ...patch } : v)));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const cleanSlug = slugify(slug || name);
    if (!name.trim()) return setMsg({ type: "err", text: "Title is required." });
    if (!cleanSlug) return setMsg({ type: "err", text: "Web address (slug) is required." });
    const vs = variants.map((v) => ({ ...v, size: v.size.trim(), p: Math.round(parseFloat(v.price) * 100), s: parseInt(v.stock || "0", 10) }));
    if (!vs.length || vs.some((v) => !v.size || !(v.p > 0) || Number.isNaN(v.s) || v.s < 0))
      return setMsg({ type: "err", text: "Every size needs a name, a price above 0 and a stock number." });
    if (new Set(vs.map((v) => v.size.toLowerCase())).size !== vs.length)
      return setMsg({ type: "err", text: "Two sizes have the same name." });

    setSaving(true);
    try {
      const fields = {
        name: name.trim(), slug: cleanSlug, tagline: tagline.trim() || null, description: description.trim() || null,
        notes: notes.split(",").map((x) => x.trim()).filter(Boolean), families,
        burn_hours: burn ? parseInt(burn, 10) : null, image_ids: images, is_active: active, is_bestseller: best,
      };
      let pid = isNew ? "" : id;
      if (isNew) {
        const { data, error } = await supabase.from("products").insert(fields).select("id").single();
        if (error) throw error;
        pid = data.id;
      } else {
        const { error } = await supabase.from("products").update(fields).eq("id", pid);
        if (error) throw error;
      }

      if (removedVariants.length) {
        const { error } = await supabase.from("variants").delete().in("id", removedVariants);
        if (error) throw error;
      }
      for (const v of vs) {
        const row = { product_id: pid, size_label: v.size, price_paise: v.p, stock: v.s, sku: `${cleanSlug}-${v.size}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-") };
        const { error } = v.id
          ? await supabase.from("variants").update(row).eq("id", v.id)
          : await supabase.from("variants").insert(row);
        if (error) throw error;
      }

      await supabase.from("product_moods").delete().eq("product_id", pid);
      const moodRows = Object.entries(moodWeights).filter(([, w]) => w > 0).map(([mood_id, weight]) => ({ product_id: pid, mood_id, weight }));
      if (moodRows.length) { const { error } = await supabase.from("product_moods").insert(moodRows); if (error) throw error; }

      await supabase.from("product_occasions").delete().eq("product_id", pid);
      if (occSel.length) { const { error } = await supabase.from("product_occasions").insert(occSel.map((occasion_id) => ({ product_id: pid, occasion_id }))); if (error) throw error; }

      await revalidateStore();
      setMsg({ type: "ok", text: "Saved. It is live on the store now." });
      setRemovedVariants([]);
      if (isNew) router.replace(`/admin/products/${pid}`);
    } catch (err: any) {
      const text = err?.code === "23505" ? "That web address or size code is already used by another product." : err?.message ?? "Could not save.";
      setMsg({ type: "err", text });
    }
    setSaving(false);
  }

  if (loading) return <p className="text-cocoa-600">Loading…</p>;

  const section = "rounded-card bg-cream-50 p-5 shadow-soft";

  return (
    <form onSubmit={save} className="mx-auto max-w-3xl space-y-5 pb-28">
      <h1 className="text-4xl sm:text-5xl">{isNew ? "New product" : "Edit product"}</h1>

      <section className={`${section} space-y-4`}>
        <div>
          <label htmlFor="name" className={label}>Title</label>
          <input id="name" value={name} className={input} placeholder="e.g. Rose Reverie" required
            onChange={(e) => { setName(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }} />
        </div>
        <div>
          <label htmlFor="slug" className={label}>Web address</label>
          <input id="slug" value={slug} className={input} placeholder="rose-reverie"
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }} />
          <p className="mt-1 text-xs text-cocoa-600">yourstore.com/shop/{slug || "…"}. Changing it breaks old links.</p>
        </div>
        <div>
          <label htmlFor="tagline" className={label}>Short line</label>
          <input id="tagline" value={tagline} maxLength={140} className={input} placeholder="A romantic blend of blooming roses and soft peony." onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div>
          <label htmlFor="desc" className={label}>Description</label>
          <textarea id="desc" value={description} rows={5} className={input} placeholder="What it smells like, when to burn it, what it is made of." onChange={(e) => setDescription(e.target.value)} />
        </div>
      </section>

      <section className={section}>
        <h2 className="text-2xl">Photos</h2>
        <div className="mt-3"><ImageUploader value={images} onChange={setImages} /></div>
      </section>

      <section className={`${section} space-y-3`}>
        <h2 className="text-2xl">Sizes and price</h2>
        {variants.map((v, i) => (
          <div key={v.id ?? i} className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-2">
            <div><label className="mb-1 block text-xs text-cocoa-600">Size</label><input value={v.size} className={input} placeholder="180g" aria-label="Size" onChange={(e) => setVariant(i, { size: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs text-cocoa-600">Price (₹)</label><input value={v.price} inputMode="decimal" className={input} placeholder="899" aria-label="Price in rupees" onChange={(e) => setVariant(i, { price: e.target.value })} /></div>
            <div><label className="mb-1 block text-xs text-cocoa-600">Stock</label><input value={v.stock} inputMode="numeric" className={input} placeholder="20" aria-label="Stock" onChange={(e) => setVariant(i, { stock: e.target.value })} /></div>
            <button type="button" aria-label="Remove size" disabled={variants.length === 1} className="grid size-11 place-items-center rounded-md border border-cocoa-900/15 text-cocoa-600 disabled:opacity-30"
              onClick={() => { if (v.id) setRemovedVariants((r) => [...r, v.id!]); setVariants((vs) => vs.filter((_, j) => j !== i)); }}><Trash2 size={16} /></button>
          </div>
        ))}
        <button type="button" className="btn-ghost min-h-11 text-sm" onClick={() => setVariants((vs) => [...vs, { size: "", price: "", stock: "20" }])}><Plus size={16} aria-hidden /> Add a size</button>
      </section>

      <section className={`${section} space-y-4`}>
        <h2 className="text-2xl">Scent details</h2>
        <div>
          <label htmlFor="notes" className={label}>Scent notes</label>
          <input id="notes" value={notes} className={input} placeholder="Rose, Peony, Musk" onChange={(e) => setNotes(e.target.value)} />
          <p className="mt-1 text-xs text-cocoa-600">Separate with commas.</p>
        </div>
        <fieldset>
          <legend className={label}>Scent family (used by the quiz)</legend>
          <div className="flex flex-wrap gap-2">
            {FAMILIES.map((f) => (
              <label key={f} className="cursor-pointer">
                <input type="checkbox" className="peer sr-only" checked={families.includes(f)} onChange={() => setFamilies((x) => (x.includes(f) ? x.filter((y) => y !== f) : [...x, f]))} />
                <span className="inline-flex min-h-10 items-center rounded-full border border-cocoa-900/15 px-4 text-sm capitalize peer-checked:border-wine-600 peer-checked:bg-wine-600 peer-checked:text-cream-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-wine-600">{f}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="burn" className={label}>Burn time (hours)</label>
          <input id="burn" value={burn} inputMode="numeric" className={`${input} max-w-32`} onChange={(e) => setBurn(e.target.value)} />
        </div>
      </section>

      <section className={`${section} space-y-3`}>
        <h2 className="text-2xl">Moods this candle fits</h2>
        <p className="text-sm text-cocoa-600">0 = not for this mood, 5 = perfect match. The Scent Finder quiz uses this.</p>
        {moods.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-3">
            <label htmlFor={`m-${m.id}`} className="text-sm">{m.name}</label>
            <select id={`m-${m.id}`} value={moodWeights[m.id] ?? 0} className="min-h-11 rounded-md border border-cocoa-900/15 bg-white px-3 text-base md:text-sm"
              onChange={(e) => setMoodWeights((w) => ({ ...w, [m.id]: Number(e.target.value) }))}>
              {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        ))}
        <fieldset className="pt-2">
          <legend className={label}>Occasions</legend>
          <div className="flex flex-wrap gap-2">
            {occasions.map((o) => (
              <label key={o.id} className="cursor-pointer">
                <input type="checkbox" className="peer sr-only" checked={occSel.includes(o.id)} onChange={() => setOccSel((x) => (x.includes(o.id) ? x.filter((y) => y !== o.id) : [...x, o.id]))} />
                <span className="inline-flex min-h-10 items-center rounded-full border border-cocoa-900/15 px-4 text-sm peer-checked:border-wine-600 peer-checked:bg-wine-600 peer-checked:text-cream-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-wine-600">{o.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={`${section} space-y-3`}>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-wine-600" checked={active} onChange={(e) => setActive(e.target.checked)} /> Show on the store</label>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-wine-600" checked={best} onChange={(e) => setBest(e.target.checked)} /> Best seller (shows on the home page)</label>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-blush-200 bg-cream-50/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="container-lume flex items-center gap-3">
          <p role="status" className={`min-w-0 flex-1 text-sm ${msg?.type === "err" ? "text-wine-700" : "text-green-800"}`}>{msg?.text}</p>
          <button disabled={saving} className="btn-primary min-h-12 shrink-0 px-8 disabled:opacity-60">{saving ? "Saving…" : "Save product"}</button>
        </div>
      </div>
    </form>
  );
}