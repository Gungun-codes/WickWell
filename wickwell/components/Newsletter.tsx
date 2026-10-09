import { supabase } from "@/lib/supabase";

async function subscribe(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return;
  // RLS allows insert only; duplicates are ignored silently.
  await supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
}

export function Newsletter() {
  return (
    <section className="bg-wine-900 py-10 text-cream-50">
      <div className="container-lume flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="text-3xl">Join our cosy corner</h2>
          <p className="mt-1 text-sm opacity-80">New drops, exclusive offers and scent stories.</p>
        </div>
        <form action={subscribe} className="flex w-full max-w-md gap-2">
          <label htmlFor="nl-email" className="sr-only">Email</label>
          <input
            id="nl-email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="min-w-0 flex-1 rounded-md bg-cream-50 px-4 py-2.5 text-sm text-cocoa-900 placeholder:text-cocoa-600"
          />
          <button className="btn-primary bg-rose-400 text-cocoa-900 hover:bg-rose-400/90">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
