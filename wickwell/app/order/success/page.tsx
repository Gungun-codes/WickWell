import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Order confirmed" };

export default function OrderSuccess({ searchParams }: { searchParams: { n?: string } }) {
  return (
    <main className="container-lume py-20 text-center">
      <h1 className="text-5xl">Thank you.</h1>
      <p className="mx-auto mt-4 max-w-md text-cocoa-600">
        {searchParams.n ? `Order #${searchParams.n} is confirmed. ` : "Your order is confirmed. "}
        We are pouring your candles now and will email you when they ship.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="btn-primary">Keep shopping</Link>
        <Link href="/account" className="btn-ghost">View my orders</Link>
      </div>
    </main>
  );
}