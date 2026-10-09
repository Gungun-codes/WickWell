import Link from "next/link";

const giftSets = [
  { title: "Starter gift box", price: "₹1,999" },
  { title: "Date-night duo", price: "₹2,499" },
  { title: "Self-care bundle", price: "₹2,999" },
  { title: "Custom scent box", price: "₹3,499" },
];

export default function GiftsPage() {
  return (
    <main className="container-lume py-16">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-cocoa-600">Gift gifting</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Thoughtful gifts for every moment.</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {giftSets.map((gift) => (
          <div key={gift.title} className="rounded-card bg-cream-50 p-5 shadow-soft">
            <div className="mb-4 aspect-[4/3] rounded-xl bg-gradient-to-br from-cocoa-900 via-wine-600 to-blush-200" />
            <h2 className="text-xl">{gift.title}</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-cocoa-600">Curated set</span>
              <span className="font-medium text-wine-600">{gift.price}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-card bg-cocoa-900 p-8 text-cream-50">
        <h2 className="text-3xl">Need a custom gift?</h2>
        <p className="mt-3 max-w-xl text-cream-50/80">
          Choose a mood, add a note, and create a candle set that feels personal.
        </p>
        <Link href="/scent-finder" className="mt-6 inline-flex rounded-md bg-cream-50 px-5 py-3 text-sm font-medium text-cocoa-900">
          Build my gift
        </Link>
      </div>
    </main>
  );
}
