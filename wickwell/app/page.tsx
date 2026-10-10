// FILE PATH: wickwell/app/page.tsx  (replace/create this file in your project)
import { Hero } from "@/components/Hero";
import { MoodStrip } from "@/components/MoodStrip";
import { BestSellers } from "@/components/BestSellers";
import { Occasions } from "@/components/Occasions";
import { Reviews, type HomeReview } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import { getBestSellers, getMoods, getOccasions, getTopReviews } from "@/lib/queries";

export const revalidate = 300; // ISR: refresh catalogue data every 5 min

export default async function HomePage() {
  const [moods, bestSellers, occasions, reviews] = await Promise.all([
    getMoods(),
    getBestSellers(),
    getOccasions(),
    getTopReviews(),
  ]);

  return (
    <main>
      <Hero />
      <MoodStrip moods={moods} />
      <BestSellers products={bestSellers} />
      <Occasions items={occasions} />
      <Reviews reviews={reviews as HomeReview[]} />
      <Newsletter />
    </main>
  );
}