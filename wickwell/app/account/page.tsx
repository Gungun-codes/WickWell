"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { rupees } from "@/lib/format";

type Order = {
  id: string; order_number: number; status: string; total_paise: number; created_at: string;
  order_items: { id: string; product_name: string; size_label: string; quantity: number }[];
};

const field = "w-full rounded-md border border-cocoa-900/15 bg-white px-4 py-3 text-sm outline-none focus:border-wine-600";

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setOrders([]); return; }
    supabase.from("orders")
      .select("id, order_number, status, total_paise, created_at, order_items(id, product_name, size_label, quantity)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [session]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setMsg("");
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")); const password = String(f.get("password"));
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { full_name: String(f.get("name") ?? "") } },
      });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Check your email to confirm your account, then sign in.");
    }
    setBusy(false);
  }

  if (!ready) return <main className="container-lume py-16"><p className="text-cocoa-600">Loading…</p></main>;

  if (session) {
    return (
      <main className="container-lume py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl sm:text-5xl">Your orders</h1>
            <p className="mt-1 text-sm text-cocoa-600">{session.user.email}</p>
          </div>
          <button className="btn-ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>

        {orders.length ? (
          <ul className="mt-8 space-y-3">
            {orders.map((o) => (
              <li key={o.id} className="rounded-card bg-cream-50 p-4 shadow-soft">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-medium">Order #{o.order_number}</p>
                  <p className="text-sm capitalize text-wine-600">{o.status}</p>
                </div>
                <p className="mt-1 text-xs text-cocoa-600">{new Date(o.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                <ul className="mt-3 text-sm text-cocoa-600">
                  {o.order_items.map((i) => <li key={i.id}>{i.product_name} ({i.size_label}) × {i.quantity}</li>)}
                </ul>
                <p className="mt-3 text-sm font-medium">{rupees(o.total_paise)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-card bg-cream-50 p-8 text-center shadow-soft">
            <p className="font-display text-2xl">No orders yet.</p>
            <Link href="/shop" className="btn-primary mt-4">Shop candles</Link>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="container-lume py-10 md:py-14">
      <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-card bg-cream-50 p-6 shadow-soft sm:p-8">
        <h1 className="text-4xl">{mode === "signin" ? "Welcome back." : "Create your account."}</h1>
        {mode === "signup" && <input name="name" required placeholder="Full name" aria-label="Full name" className={field} />}
        <input name="email" type="email" required autoComplete="email" placeholder="Email" aria-label="Email" className={field} />
        <input name="password" type="password" required minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} placeholder="Password (8+ characters)" aria-label="Password" className={field} />
        {msg && <p role="alert" className="text-sm text-wine-700">{msg}</p>}
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}</button>
        <button type="button" className="w-full text-sm text-wine-600 hover:underline" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(""); }}>
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}