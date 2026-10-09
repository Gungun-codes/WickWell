import { Star } from "lucide-react";

// Placeholder until real reviews exist. Replace with a query on `reviews`.
const quotes = [
  { text: "Literally smells like my Pinterest board.", name: "Aarushi", city: "Delhi" },
  { text: "My new comfort ritual. Obsessed!", name: "Riya", city: "Mumbai" },
  { text: "Makes my room feel so warm and cozy.", name: "Sneha", city: "Bengaluru" },
  { text: "Packaging, fragrance, everything is perfect!", name: "Priya", city: "Jaipur" },
];

export function Reviews() {
  return (
    <section className="container-lume py-10">
      <h2 className="text-3xl">Real people, real moods</h2>
      <p className="mt-1 text-sm text-cocoa-600">Loved by candle lovers.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quotes.map((q) => (
          <li key={q.name} className="rounded-card bg-cream-50 p-4 shadow-soft">
            <div className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-gold-400 text-gold-400" />
              ))}
            </div>
            <p className="mt-2 text-sm">{q.text}</p>
            <p className="mt-3 text-xs text-cocoa-600">{q.name}, {q.city}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
