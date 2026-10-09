import { supabase } from "./supabase";

export type Variant = { id: string; size_label: string; price_paise: number; stock: number };

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  notes: string[];
  image_ids: string[];
  variants: Variant[];
  avg_rating: number | null;
  review_count: number;
};

const CARD_SELECT = "id, slug, name, notes, image_ids, variants(id, size_label, price_paise, stock)";

async function withRatings(products: any[]): Promise<ProductCardData[]> {
  if (!products.length) return [];
  const { data: ratings } = await supabase
    .from("product_ratings")
    .select("product_id, avg_rating, review_count")
    .in("product_id", products.map((p) => p.id));
  const byId = new Map(ratings?.map((r) => [r.product_id, r]));
  return products.map((p) => ({
    ...p,
    variants: [...(p.variants ?? [])].sort((a: Variant, b: Variant) => a.price_paise - b.price_paise),
    avg_rating: byId.get(p.id)?.avg_rating ?? null,
    review_count: Number(byId.get(p.id)?.review_count ?? 0),
  }));
}

export async function getBestSellers(limit = 4) {
  const { data } = await supabase
    .from("products").select(CARD_SELECT)
    .eq("is_active", true).eq("is_bestseller", true).limit(limit);
  return withRatings(data ?? []);
}

export type ShopFilters = { mood?: string; occasion?: string; sort?: string; q?: string };

export async function getProducts({ mood, occasion, sort, q }: ShopFilters = {}) {
  let ids: string[] | null = null;

  if (mood) {
    const { data } = await supabase
      .from("product_moods").select("product_id, moods!inner(slug)").eq("moods.slug", mood);
    ids = (data ?? []).map((r: any) => r.product_id);
  }
  if (occasion) {
    const { data } = await supabase
      .from("product_occasions").select("product_id, occasions!inner(slug)").eq("occasions.slug", occasion);
    const occ = (data ?? []).map((r: any) => r.product_id);
    ids = ids ? ids.filter((i) => occ.includes(i)) : occ;
  }
  if (ids && ids.length === 0) return [];

  let query = supabase.from("products").select(CARD_SELECT).eq("is_active", true);
  if (ids) query = query.in("id", ids);
  if (q) {
    const term = q.replace(/[%,()]/g, " ").trim();
    if (term) query = query.or(`name.ilike.%${term}%,tagline.ilike.%${term}%,notes.cs.{${term}},families.cs.{${term.toLowerCase()}}`);
  }
  if (sort === "best") query = query.order("is_bestseller", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data } = await query;
  let list = await withRatings(data ?? []);
  if (sort === "price-asc") list.sort((a, b) => a.variants[0]?.price_paise - b.variants[0]?.price_paise);
  if (sort === "price-desc") list.sort((a, b) => b.variants[0]?.price_paise - a.variants[0]?.price_paise);
  return list;
}

export async function getProductBySlug(slug: string) {
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, tagline, description, notes, families, burn_hours, image_ids, variants(id, size_label, price_paise, stock)")
    .eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!data) return null;
  return { ...data, variants: [...data.variants].sort((a, b) => a.price_paise - b.price_paise) };
}

export async function getReviews(productId: string) {
  const { data } = await supabase
    .from("reviews").select("id, rating, title, body, created_at")
    .eq("product_id", productId).order("created_at", { ascending: false }).limit(10);
  return data ?? [];
}

export async function getRelated(productId: string, limit = 3) {
  const { data: pairs } = await supabase
    .from("product_pairings").select("paired_product_id").eq("product_id", productId);
  const ids = (pairs ?? []).map((p) => p.paired_product_id);
  let q = supabase.from("products").select(CARD_SELECT).eq("is_active", true).limit(limit);
  q = ids.length ? q.in("id", ids) : q.neq("id", productId);
  const { data } = await q;
  return withRatings(data ?? []);
}

export async function getMoods() {
  const { data } = await supabase.from("moods").select("slug, name, image_id").order("sort_order");
  return data ?? [];
}

export async function getOccasions() {
  const { data } = await supabase.from("occasions").select("slug, name, image_id").order("sort_order");
  return data ?? [];
}

/** Scent Finder V1: mood fit x3 + scent-family overlap x2 (mirrors api/main.py). */
export async function getMatches(mood: string, families: string[], limit = 3) {
  const { data } = await supabase
    .from("products")
    .select(`${CARD_SELECT}, families, product_moods(weight, moods(slug))`)
    .eq("is_active", true);

  const scored = (data ?? [])
    .map((p: any) => {
      const moodScore = (p.product_moods ?? [])
        .filter((pm: any) => pm.moods?.slug === mood)
        .reduce((n: number, pm: any) => n + pm.weight * 3, 0);
      const famScore = 2 * (p.families ?? []).filter((f: string) => families.includes(f)).length;
      return { p, score: moodScore + famScore };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);

  if (scored.length) return withRatings(scored);
  return getBestSellers(limit);
}