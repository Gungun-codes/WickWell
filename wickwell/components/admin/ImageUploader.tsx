// FILE PATH: wickwell/components/admin/ImageUploader.tsx  (replace this file in your project)
"use client";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Link2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cld } from "@/lib/cloudinary";

const CLOUD = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "").trim();
const PRESET = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "").trim();
const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").trim().replace(/\/+$/, "");
const FOLDER = "wickwell/products";
const MAX_MB = 8;

/** Turns a pasted Cloudinary link (or a bare public id) into the public id we store. */
export function toPublicId(input: string, cloud = CLOUD): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (!/^https?:\/\//i.test(raw)) return raw.replace(/\.[a-z0-9]+$/i, "").replace(/^\/+/, "") || null;
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  if (!u.hostname.endsWith("res.cloudinary.com")) return null;
  const parts = u.pathname.split("/").filter(Boolean); // [cloud, image, upload, ...rest]
  if (cloud && parts[0] !== cloud) return null;
  const at = parts.indexOf("upload");
  if (at < 0) return null;
  let rest = parts.slice(at + 1);
  // drop transformation segments (f_auto,w_300) and the version (v1234567890)
  while (rest.length > 1 && (rest[0].includes(",") || /^[a-z]{1,3}_[^/]+$/i.test(rest[0]) || /^v\d+$/.test(rest[0]))) rest = rest.slice(1);
  const id = decodeURIComponent(rest.join("/")).replace(/\.[a-z0-9]+$/i, "");
  return id || null;
}

/**
 * Photo picker for the admin.
 *  1) If NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is set: uploads straight from the browser to Cloudinary (no server needed).
 *  2) Otherwise: asks our Python API for a signed permission first.
 *  3) Always: you can paste a Cloudinary image link instead.
 * First image = main photo.
 */
export function ImageUploader({ value, onChange, max }: { value: string[]; onChange: (ids: string[]) => void; max?: number }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  const commit = (added: string[]) => {
    const fresh = added.filter((id) => !value.includes(id));
    if (fresh.length) onChange(max ? [...value, ...fresh].slice(-max) : [...value, ...fresh]);
  };

  async function uploadDirect(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", PRESET);
    fd.append("folder", FOLDER);
    let up: Response;
    try { up = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: fd }); }
    catch { throw new Error("Could not reach Cloudinary. Check your internet connection."); }
    const j = await up.json().catch(() => ({}));
    if (!up.ok) {
      const m = String(j.error?.message ?? up.status);
      if (/preset/i.test(m)) throw new Error(`Cloudinary says "${m}". In Cloudinary → Settings → Upload → Upload presets, the preset "${PRESET}" must exist and be set to Signing mode: Unsigned.`);
      if (/cloud name/i.test(m) || up.status === 401) throw new Error(`Cloudinary says "${m}". Check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (it is the cloud name, not the API key).`);
      throw new Error(`Cloudinary says "${m}".`);
    }
    return j.public_id as string;
  }

  async function uploadSigned(file: File): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("You are signed out. Sign in again and retry.");
    let r: Response;
    try { r = await fetch(`${API}/admin/upload-signature`, { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } }); }
    catch {
      throw new Error(API.includes("localhost")
        ? "No upload method is set up. Easiest fix: add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in Vercel (see the setup steps), or paste an image link below."
        : `Cannot reach the API at ${API}. Easiest fix: add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in Vercel, or paste an image link below.`);
    }
    if (!r.ok) {
      const detail = (await r.json().catch(() => null))?.detail;
      if (r.status === 401) throw new Error("The API did not accept your login. Sign out, sign in again and retry.");
      if (r.status === 403) throw new Error("This account is not an admin (profiles.is_admin must be true).");
      throw new Error(`API error (${r.status}): ${typeof detail === "string" ? detail : "check the API logs."}`);
    }
    const sig = await r.json();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", sig.api_key);
    fd.append("timestamp", String(sig.timestamp));
    fd.append("folder", sig.folder);
    fd.append("signature", sig.signature);
    let up: Response;
    try { up = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`, { method: "POST", body: fd }); }
    catch { throw new Error("Could not reach Cloudinary. Check your internet connection."); }
    const j = await up.json().catch(() => ({}));
    if (!up.ok) throw new Error(`Cloudinary says "${j.error?.message ?? up.status}". Check the Cloudinary keys on the API server.`);
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
        added.push(CLOUD && PRESET ? await uploadDirect(f) : await uploadSigned(f));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
    commit(added);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  function addLink() {
    setError("");
    const id = toPublicId(link);
    if (!id) {
      setError(CLOUD
        ? `That is not a Cloudinary link for your account (${CLOUD}). Copy the image URL from Cloudinary → Media Library, or type its public id.`
        : "Paste a Cloudinary image link or its public id.");
      return;
    }
    commit([id]); setLink("");
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

      {(!max || value.length < max) && (
        <div className="mt-3 flex max-w-md gap-2">
          <label htmlFor="img-link" className="sr-only">Cloudinary image link</label>
          <input id="img-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Or paste a Cloudinary image link"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }}
            className="min-w-0 flex-1 rounded-md border border-cocoa-900/15 bg-white px-3 py-2.5 text-base outline-none focus:border-wine-600 md:text-sm" />
          <button type="button" onClick={addLink} className="btn-ghost min-h-11 shrink-0 px-4 text-sm"><Link2 size={16} aria-hidden /> Add</button>
        </div>
      )}

      {error && <p role="alert" className="mt-2 text-sm text-wine-700">{error}</p>}
      <p className="mt-2 text-xs text-cocoa-600">{max === 1 ? "One photo." : "First photo is the main one."} Square or 4:3 photos, at least 800px, look best. Max {MAX_MB} MB each.</p>
    </div>
  );
}