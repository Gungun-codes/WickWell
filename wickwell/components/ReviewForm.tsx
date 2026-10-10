// FILE PATH: wickwell/components/ReviewForm.tsx  (replace/create this file in your project)
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const field =
  "w-full rounded-md border border-cocoa-900/15 bg-white px-4 py-3 text-base outline-none focus:border-wine-600 md:text-sm";

/** Only verified buyers can post (enforced by a database policy, not just this form). */
export function ReviewForm({ productId }: { productId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
  }, []);

  if (!ready) return null;

  if (!session) {
    return (
      <p className="mt-6 text-sm text-cocoa-600">
        Bought this candle? <Link href="/account" className="text-wine-600 underline">Sign in</Link> to leave a review.
      </p>
    );
  }
  if (done) return <p className="mt-6 rounded-card bg-cream-50 p-4 text-sm shadow-soft">Thank you! Your review will show up shortly.</p>;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!rating) { setMsg("Please pick a star rating."); return; }
    setBusy(true); setMsg("");
    const f = new FormData(e.currentTarget);
    const user = session!.user;
    const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Customer";
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating,
      title: String(f.get("title") ?? "").trim() || null,
      body: String(f.get("body") ?? "").trim() || null,
      reviewer_name: name,
    });
    setBusy(false);
    if (!error) { setDone(true); return; }
    if (error.code === "23505") setMsg("You have already reviewed this candle.");
    else if (error.code === "42501") setMsg("Only customers who bought this candle with this account can review it.");
    else setMsg(error.message);
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-3 rounded-card bg-cream-50 p-5 shadow-soft">
      <h3 className="font-display text-2xl">Write a review</h3>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => setRating(n)} className="grid size-11 place-items-center"
          >
            <Star size={26} className={n <= rating ? "fill-gold-400 text-gold-400" : "text-cocoa-900/25"} />
          </button>
        ))}
      </div>
      <input name="title" maxLength={80} placeholder="Headline (optional)" aria-label="Review headline" className={field} />
      <textarea name="body" required minLength={10} maxLength={1000} rows={4} placeholder="How does it smell and burn?" aria-label="Review" className={field} />
      {msg && <p role="alert" className="text-sm text-wine-700">{msg}</p>}
      <button disabled={busy} className="btn-primary min-h-12 disabled:opacity-60">{busy ? "Posting…" : "Post review"}</button>
    </form>
  );
}