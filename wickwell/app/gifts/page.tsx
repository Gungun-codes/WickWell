import { supabase } from "@/lib/supabase";

async function subscribe(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return;

  await supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
}

export default function GiftsPage() {
  return (
    <main className="container-lume py-16 md:py-20">
      <section className="mx-auto max-w-2xl rounded-card bg-cream-50 p-8 text-center shadow-soft sm:p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-wine-600">Gifts</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Coming soon</h1>
        <p className="mt-4 text-lg text-cocoa-600">
          Be the first one to know when gifts get live.
        </p>

        <form action={subscribe} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="gift-email" className="sr-only">Email</label>
          <input
            id="gift-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="min-w-0 flex-1 rounded-md border border-cocoa-200 bg-white px-4 py-3 text-base text-cocoa-900 placeholder:text-cocoa-600"
          />
          <button type="submit" className="btn-primary min-h-12">
            Notify me
          </button>
        </form>
      </section>
    </main>
  );
}
