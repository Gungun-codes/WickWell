import Link from "next/link";

export default function OurStoryPage() {
  return (
    <main className="container-lume py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cocoa-600">Our story</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Candles made for everyday rituals.</h1>
          <p className="mt-5 max-w-xl text-base text-cocoa-600">
            WickWell began with a simple idea: scent should feel like a companion, not just a fragrance. We create small-batch candles that turn quiet moments into rituals.
          </p>
          <p className="mt-4 max-w-xl text-base text-cocoa-600">
            Every blend is hand-poured with clean ingredients and designed to fit your mood, your home, and your pace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn-primary">Shop candles</Link>
            <Link href="/scent-finder" className="btn-ghost">Find my scent</Link>
          </div>
        </div>

        <div className="rounded-card bg-gradient-to-br from-blush-200 via-cream-50 to-cream-100 p-6 shadow-soft">
          <div className="aspect-[4/5] rounded-card bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_30%),linear-gradient(135deg,#3a0f14,#8c1d2e_40%,#f5dcd6)]" />
        </div>
      </div>
    </main>
  );
}
