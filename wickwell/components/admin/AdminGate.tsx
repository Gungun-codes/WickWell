// FILE PATH: wickwell/components/admin/AdminGate.tsx  (replace/create this file in your project)
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "anon" | "denied" | "ok";

/** UI gate only. The real protection is Row Level Security: non-admins cannot write even if they reach this page. */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const path = usePathname();

  useEffect(() => {
    let alive = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return alive && setStatus("anon");
      const { data: prof } = await supabase.from("profiles").select("is_admin").eq("id", data.session.user.id).maybeSingle();
      if (alive) setStatus(prof?.is_admin ? "ok" : "denied");
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  if (status === "loading") return <main className="container-lume py-16 text-cocoa-600">Checking access…</main>;

  if (status === "anon" || status === "denied") {
    return (
      <main className="container-lume max-w-md py-16 text-center">
        <h1 className="text-4xl">{status === "anon" ? "Sign in to continue" : "Admins only"}</h1>
        <p className="mt-3 text-cocoa-600">
          {status === "anon"
            ? "Sign in with your admin account to manage products and reviews."
            : "This account is not an admin. Ask the store owner to enable it."}
        </p>
        <Link href="/account" className="btn-primary mt-6 min-h-12">{status === "anon" ? "Go to sign in" : "Switch account"}</Link>
      </main>
    );
  }

  const tab = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm ${active ? "bg-wine-600 text-cream-50" : "border border-cocoa-900/15"}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="container-lume py-8 md:py-12">
      <div className="flex flex-wrap items-center gap-2">
        {tab("/admin", "Products", path === "/admin" || path.startsWith("/admin/products"))}
        {tab("/admin/reviews", "Reviews", path.startsWith("/admin/reviews"))}
        <Link href="/" className="ml-auto text-sm text-wine-600 hover:underline">View store →</Link>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}