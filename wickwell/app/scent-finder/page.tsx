import type { Metadata } from "next";
import { Quiz } from "@/components/Quiz";
import { getMoods } from "@/lib/queries";

export const metadata: Metadata = { title: "Scent finder" };

export default async function ScentFinderPage({ searchParams }: { searchParams: { mood?: string } }) {
  const moods = await getMoods();
  return (
    <main className="container-lume py-10 md:py-14">
      <Quiz moods={moods} initialMood={searchParams.mood} />
    </main>
  );
}