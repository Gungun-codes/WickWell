// FILE PATH: wickwell/app/[page]/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/InfoPage";

// Remaining small info pages. FAQs, Shipping, Returns, Terms, Privacy, Contact and Our Story have their own pages.
// TODO: replace this copy with your real ingredient list and sustainability practices before launch.
const pages: Record<string, { title: string; intro: string; p: string[] }> = {
  ingredients: {
    title: "Ingredients",
    intro: "What goes into a WickWell candle.",
    p: ["The full ingredient list for each candle is on its product page. If you have allergies or a sensitive nose, check it first or write to us and we will help you choose."],
  },
  sustainability: {
    title: "Sustainability",
    intro: "Small batches, less waste.",
    p: ["We pour in small batches so we make what we can sell, and we pack with care to keep waste low. We are always looking for better materials, and we will share what we change."],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { page: string } }): Metadata {
  return { title: pages[params.page]?.title ?? "Not found" };
}

export default function InfoRoute({ params }: { params: { page: string } }) {
  const p = pages[params.page];
  if (!p) notFound();
  return <InfoPage title={p.title} intro={p.intro} blocks={[{ h: p.title, p: p.p }]} updated={false} />;
}