import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  const seen = Object.keys(process.env).filter((k) => k.startsWith("NEXT_PUBLIC_"));
  throw new Error(
    [
      "Supabase env vars missing at build time.",
      `URL: ${url ? "found" : "MISSING"}`,
      `ANON_KEY: ${key ? "found" : "MISSING"}`,
      `Vercel environment of this build: ${process.env.VERCEL_ENV ?? "unknown"}`,
      `NEXT_PUBLIC_* names this build can see: ${seen.length ? seen.join(", ") : "(none)"}`,
    ].join(" | ")
  );
}

export const supabase = createClient(url, key);