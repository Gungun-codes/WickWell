// FILE PATH: wickwell/app/page.tsx  (replace/create this file in your project)
import { Hero } from "@/components/Hero";
import { MoodStrip } from "@/components/MoodStrip";
import { BestSellers } from "@/components/BestSellers";
import { Occasions } from "@/components/Occasions";
import { Categories } from "@/components/Categories";
import { Reviews, type HomeReview } from "@/components/Reviews";
import { Newsletter } from "@/components/Newsletter";
import { getBestSellers, getCategories, getMoods, getOccasions, getTopReviews } from "@/lib/queries";

export const revalidate = 300; // ISR: refresh catalogue data every 5 min

export default async function HomePage() {
  const [moods, bestSellers, occasions, categories, reviews] = await Promise.all([
    getMoods(),
    getBestSellers(),
    getOccasions(),
    getCategories(),
    getTopReviews(),
  ]);

  return (
    <main>
      <Hero />
      <MoodStrip moods={moods} />
      <BestSellers products={bestSellers} />
      <Categories items={categories} />
      <Occasions items={occasions} />
      <Reviews reviews={reviews as HomeReview[]} />
      <Newsletter />
    </main>
  );
}