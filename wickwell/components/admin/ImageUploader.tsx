// FILE PATH: wickwell/components/admin/ImageUploader.tsx  (replace this file in your project)
"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cld } from "@/lib/cloudinary";

const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").trim().replace(/\/+$/, "");
const MAX_MB = 8;

/** Uploads straight to Cloudinary using a signature from our Python API (admin-only). First image = main photo. */
export function ImageUploader({ value, onChange, max }: { value: string[]; onChange: (ids: string[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function uploadOne(file: File): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("You are signed out. Sign in again and retry.");

    // Step 1: ask our API for a signed upload permission.
    let r: Response;
    try {
      r = await fetch(`${API}/admin/upload-signature`, { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } });
    } catch {
      throw new Error(
        API.includes("localhost")
          ? "Step 1 failed: the site is pointing at localhost. Set NEXT_PUBLIC_API_URL in Vercel to your deployed Python API URL, then redeploy."
          : `Step 1 failed: cannot reach the API at ${API}. It may be asleep or down, or its ALLOWED_ORIGINS does not include this website. Open ${API}/health to check.`
      );
    }
    if (!r.ok) {
      const detail = (await r.json().catch(() => null))?.detail;
      if (r.status === 401) throw new Error("Step 1 failed: the API did not accept your login. Sign out, sign in again and retry.");
      if (r.status === 403) throw new Error("Step 1 failed: this account is not an admin (profiles.is_admin must be true).");
      throw new Error(`Step 1 failed (${r.status}): ${typeof detail === "string" ? detail : "the API returned an error. Check its logs."}`);
    }
    const sig = await r.json();

    // Step 2: upload straight to Cloudinary with that signature.
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.api_key);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("folder", sig.folder);
    fd.append("signature", sig.signature);
    let up: Response;
    try {
      up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: "POST", body: fd });
    } catch {
      throw new Error("Step 2 failed: could not reach Cloudinary. Check your internet connection.");
    }
    const j = await up.json().catch(() => ({}));
    if (!up.ok) throw new Error(`Step 2 failed: Cloudinary says "${j.error?.message ?? up.status}". Check CLOUDINARY_CLOUD_NAME, API_KEY and API_SECRET on the API server.`);
    return j.public_id as string;
  }

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setError(""); setBusy(true);
    const added: string[] = [];
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith("image/")) throw new Error(`${f.name} is not an image.`);
        if (f.size > MAX_MB * 1024 * 1024) throw new Error(`${f.name} is over ${MAX_MB} MB.`);
        added.push(await uploadOne(f));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
    if (added.length) onChange(max ? [...value, ...added].slice(-max) : [...value, ...added]);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  const move = (i: number, d: -1 | 1) => {
    const next = [...value]; const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <ul className={max === 1 ? "grid w-28 grid-cols-1 gap-3" : "grid grid-cols-3 gap-3 sm:grid-cols-4"}>
        {value.map((id, i) => (
          <li key={id} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cld(id, 300)} alt="" className="aspect-square w-full rounded-lg object-cover" />
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-cocoa-900/80 px-1.5 py-0.5 text-[10px] text-cream-50">Main</span>}
            <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((x) => x !== id))}
              className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-cocoa-900/80 text-cream-50"><X size={14} /></button>
            <div className="mt-1 flex justify-between">
              <button type="button" aria-label="Move earlier" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-9 place-items-center rounded-md border border-cocoa-900/15 disabled:opacity-30"><ArrowLeft size={14} /></button>
              <button type="button" aria-label="Move later" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="grid size-9 place-items-center rounded-md border border-cocoa-900/15 disabled:opacity-30"><ArrowRight size={14} /></button>
            </div>
          </li>
        ))}
        {(!max || value.length < max) && <li>
          <button type="button" disabled={busy} onClick={() => input.current?.click()}
            className="grid aspect-square w-full place-items-center rounded-lg border-2 border-dashed border-cocoa-900/25 text-sm text-cocoa-600 hover:border-wine-600 hover:text-wine-600 disabled:opacity-60">
            <span className="flex flex-col items-center gap-1"><ImagePlus size={22} aria-hidden />{busy ? "Uploading…" : "Add photos"}</span>
          </button>
        </li>}
      </ul>
      <input ref={input} type="file" accept="image/*" multiple={max !== 1} hidden onChange={(e) => onPick(e.target.files)} />
      {error && <p role="alert" className="mt-2 text-sm text-wine-700">{error}</p>}
      <p className="mt-2 text-xs text-cocoa-600">{max === 1 ? "One photo." : "First photo is the main one."} Square or 4:3 photos, at least 800px, look best. Max {MAX_MB} MB each.</p>
    </div>
  );
}