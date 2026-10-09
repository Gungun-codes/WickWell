"use server";
import { getMatches } from "@/lib/queries";

export async function recommend(mood: string, families: string[]) {
  const safeFamilies = families.filter((f) => ["floral", "woody", "sweet", "fresh"].includes(f));
  return getMatches(String(mood).slice(0, 40), safeFamilies, 3);
}