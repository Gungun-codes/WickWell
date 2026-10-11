"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

type Filters = { mood?: string; occasion?: string; sort?: string };
type Option = { slug: string; name: string };

const sorts = [
  { value: "new", label: "Newest" },
  { value: "best", label: "Best sellers" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function href(filters: Filters, patch: Partial<Filters>) {
  const next = { ...filters, ...patch };
  const query = new URLSearchParams(Object.entries(next).filter(([, value]) => value) as [string, string][]);
  return query.size ? `/shop?${query}` : "/shop";
}

const chip = (active: boolean) =>
  `inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm transition ${
    active ? "border-wine-600 bg-wine-600 text-cream-50" : "border-cocoa-900/15 hover:border-wine-600 hover:text-wine-600"
  }`;

export function ShopFilterDrawer({
  filters,
  moods,
  occasions,
}: {
  filters: Filters;
  moods: Option[];
  occasions: Option[];
}) {
  const [open, setOpen] = useState(false);
  const activeCount = Number(!!filters.mood) + Number(!!filters.occasion) + Number(!!filters.sort && filters.sort !== "new");

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="shop-filter-drawer"
        className="btn-ghost mt-6"
      >
        <SlidersHorizontal size={18} aria-hidden />
        Filters{activeCount > 0 ? ` (${activeCount})` : ""}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="absolute inset-0 size-full bg-cocoa-900/50"
          />
          <section
            id="shop-filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shop-filter-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col bg-cream-100 shadow-soft"
          >
            <header className="flex items-center justify-between border-b border-cocoa-900/10 px-5 py-4">
              <h2 id="shop-filter-title" className="text-3xl">Filters</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="grid size-11 place-items-center rounded-full hover:bg-black/5"
              >
                <X size={20} aria-hidden />
              </button>
            </header>

            <div className="flex-1 space-y-6 overflow-y-auto p-5">
              <fieldset>
                <legend className="mb-3 text-sm font-medium">Mood</legend>
                <div className="flex flex-wrap gap-2">
                  <Link href={href(filters, { mood: undefined })} onClick={() => setOpen(false)} className={chip(!filters.mood)}>All</Link>
                  {moods.map((mood) => (
                    <Link
                      key={mood.slug}
                      href={href(filters, { mood: mood.slug })}
                      onClick={() => setOpen(false)}
                      className={chip(filters.mood === mood.slug)}
                    >
                      {mood.name}
                    </Link>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium">Occasion</legend>
                <div className="flex flex-wrap gap-2">
                  <Link href={href(filters, { occasion: undefined })} onClick={() => setOpen(false)} className={chip(!filters.occasion)}>Any</Link>
                  {occasions.map((occasion) => (
                    <Link
                      key={occasion.slug}
                      href={href(filters, { occasion: occasion.slug })}
                      onClick={() => setOpen(false)}
                      className={chip(filters.occasion === occasion.slug)}
                    >
                      {occasion.name}
                    </Link>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium">Sort by</legend>
                <div className="flex flex-wrap gap-2">
                  {sorts.map((sort) => (
                    <Link
                      key={sort.value}
                      href={href(filters, { sort: sort.value })}
                      onClick={() => setOpen(false)}
                      className={chip((filters.sort ?? "new") === sort.value)}
                    >
                      {sort.label}
                    </Link>
                  ))}
                </div>
              </fieldset>
            </div>

            <footer className="flex gap-3 border-t border-cocoa-900/10 p-5">
              <Link href="/shop" onClick={() => setOpen(false)} className="btn-ghost flex-1">Clear all</Link>
              <button type="button" onClick={() => setOpen(false)} className="btn-primary flex-1">Done</button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
