// FILE PATH: wickwell/app/checkout/page.tsx  (replace this file in your project)
"use client";
import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";
import { shippingFor } from "@/lib/pricing";
import { supabase } from "@/lib/supabase";

const API = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").trim().replace(/\/+$/, "");

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayFailure = {
  error?: { description?: string; reason?: string };
};

declare global {
  interface Window {
    Razorpay?: new (opts: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill: { name: string; email: string; contact: string };
      theme: { color: string };
      modal: { ondismiss: () => void };
      handler: (response: RazorpaySuccess) => void;
    }) => {
      open: () => void;
      on: (event: "payment.failed", handler: (response: RazorpayFailure) => void) => void;
    };
  }
}

const field =
  "w-full rounded-md border border-cocoa-900/15 bg-white px-4 py-3 text-base outline-none md:text-sm focus:border-wine-600";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, ready, subtotalPaise, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkoutLoaded, setCheckoutLoaded] = useState(false);
  const shipping = shippingFor(subtotalPaise);

  if (ready && !lines.length) {
    return (
      <main className="container-lume py-16 text-center">
        <h1 className="text-4xl">Nothing to check out yet.</h1>
        <Link href="/shop" className="btn-primary mt-6">Shop candles</Link>
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          email: get("email"),
          items: lines.map((l) => ({ variant_id: l.variantId, quantity: l.qty })),
          address: {
            full_name: get("name"), phone: get("phone"), line1: get("line1"),
            line2: get("line2") || null, city: get("city"), state: get("state"), pincode: get("pincode"),
          },
        }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(typeof order.detail === "string" ? order.detail : "Could not create your order.");
      if (!window.Razorpay) throw new Error("Payment window failed to load. Refresh and try again.");

      const checkout = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "WickWell",
        description: `Order #${order.order_number}`,
        order_id: order.order_id,
        prefill: { name: get("name"), email: get("email"), contact: get("phone") },
        theme: { color: "#8c1d2e" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (response: RazorpaySuccess) => {
          try {
            const verification = await fetch(`${API}/orders/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            if (!verification.ok) {
              setError("Payment received but we could not confirm it yet. Do not pay again; we will email you shortly.");
              setBusy(false);
              return;
            }
            clear();
            router.push(`/order/success?n=${order.order_number}`);
          } catch {
            setError("Payment received but we could not confirm it yet. Do not pay again; we will email you shortly.");
            setBusy(false);
          }
        },
      });
      checkout.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed. Please try again.");
        setBusy(false);
      });
      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <main className="container-lume py-10 md:py-14">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setCheckoutLoaded(true)}
        onError={() => {
          setCheckoutLoaded(false);
          setError("Secure checkout could not load. Check your connection and refresh the page.");
        }}
      />
      <h1 className="text-4xl sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-4 rounded-card bg-cream-50 p-6 shadow-soft">
          <h2 className="text-2xl">Delivery details</h2>
          <input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} aria-label="Email" />
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="name" required autoComplete="name" placeholder="Full name" className={field} aria-label="Full name" />
            <input name="phone" required inputMode="tel" pattern="[6-9][0-9]{9}" title="10-digit Indian mobile number" autoComplete="tel-national" placeholder="Mobile (10 digits)" className={field} aria-label="Mobile number" />
          </div>
          <input name="line1" required autoComplete="address-line1" placeholder="Address line 1" className={field} aria-label="Address line 1" />
          <input name="line2" autoComplete="address-line2" placeholder="Address line 2 (optional)" className={field} aria-label="Address line 2" />
          <div className="grid gap-4 sm:grid-cols-3">
            <input name="city" required autoComplete="address-level2" placeholder="City" className={field} aria-label="City" />
            <input name="state" required autoComplete="address-level1" placeholder="State" className={field} aria-label="State" />
            <input name="pincode" required inputMode="numeric" pattern="[1-9][0-9]{5}" title="6-digit pincode" autoComplete="postal-code" placeholder="Pincode" className={field} aria-label="Pincode" />
          </div>

          {error && <p role="alert" className="rounded-md bg-wine-600/10 px-4 py-3 text-sm text-wine-700">{error}</p>}

          <button disabled={busy || !ready || !checkoutLoaded} className="btn-primary w-full disabled:opacity-50">
            {busy ? "Opening payment…" : !checkoutLoaded ? "Loading secure checkout…" : `Pay ${rupees(subtotalPaise + shipping)}`}
          </button>
          <p className="text-center text-xs text-cocoa-600">Secure payment by Razorpay: UPI, cards, netbanking and wallets.</p>
        </form>

        <aside className="h-fit rounded-card bg-cream-50 p-6 shadow-soft">
          <h2 className="text-2xl">Your order</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.variantId} className="flex justify-between gap-3">
                <span>{l.name} <span className="text-cocoa-600">({l.size}) × {l.qty}</span></span>
                <span>{rupees(l.pricePaise * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-cocoa-900/10 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-cocoa-600">Subtotal</dt><dd>{rupees(subtotalPaise)}</dd></div>
            <div className="flex justify-between"><dt className="text-cocoa-600">Shipping</dt><dd>{shipping ? rupees(shipping) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 font-medium"><dt>Total</dt><dd>{rupees(subtotalPaise + shipping)}</dd></div>
          </dl>
          <p className="mt-4 text-xs text-cocoa-600">Final prices are confirmed on our server when you pay.</p>
        </aside>
      </div>
    </main>
  );
}