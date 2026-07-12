import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Asset, Tint } from "@/lib/mock";

function serverClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

type Row = {
  id: string;
  slug: string;
  tc: string;
  kind: string;
  title: string;
  creator: string;
  handle: string;
  price: string | number;
  original_price: string | number | null;
  rating: string | number;
  reviews: number;
  downloads: string;
  size: string;
  software: string[];
  updated: string;
  version: string;
  img_key: string;
  tint: string;
  category: string;
  tags: string[];
  featured: boolean;
  staff_pick: boolean;
  best_seller: boolean;
  is_new: boolean;
  flash_deal: boolean;
  description?: string;
};

function toAsset(r: Row): Asset & { description?: string; img_key: string } {
  return {
    id: r.id,
    slug: r.slug,
    tc: r.tc,
    kind: r.kind,
    title: r.title,
    creator: r.creator,
    handle: r.handle,
    price: Number(r.price),
    originalPrice: r.original_price == null ? undefined : Number(r.original_price),
    rating: Number(r.rating),
    reviews: r.reviews,
    downloads: r.downloads,
    size: r.size,
    software: r.software ?? [],
    updated: r.updated,
    version: r.version,
    img: "", // resolved on client via img_key
    img_key: r.img_key,
    tint: (r.tint as Tint) ?? "cyan",
    category: r.category,
    tags: r.tags ?? [],
    featured: r.featured,
    staffPick: r.staff_pick,
    bestSeller: r.best_seller,
    new: r.is_new,
    flashDeal: r.flash_deal,
    description: r.description,
  };
}

const listInput = z.object({
  q: z.string().trim().max(200).optional(),
  category: z.string().optional(),
  software: z.string().optional(),
  price: z.enum(["Any", "Free", "Under $20", "$20–$50", "$50+"]).optional(),
  rating: z.enum(["Any", "4.5+", "4.8+", "5.0"]).optional(),
  type: z.enum(["All", "Free", "Premium"]).optional(),
  sort: z
    .enum([
      "Trending",
      "Newest",
      "Best selling",
      "Highest rated",
      "Lowest price",
      "Highest price",
      "Recently updated",
    ])
    .optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const listAssets = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listInput.parse(input ?? {}))
  .handler(async ({ data }) => {
    const supabase = serverClient();
    let q = supabase.from("assets").select("*").limit(data.limit ?? 60);

    if (data.q && data.q.length > 0) {
      // Websearch is forgiving with quotes and operators; fall back to ilike on title.
      const escaped = data.q.replace(/[%_]/g, "\\$&");
      q = q.or(
        `title.ilike.%${escaped}%,description.ilike.%${escaped}%,category.ilike.%${escaped}%`,
      );
    }
    if (data.category && data.category !== "All") q = q.eq("category", data.category);
    if (data.software && data.software !== "All") q = q.contains("software", [data.software]);
    if (data.type === "Free" || data.price === "Free") q = q.eq("price", 0);
    if (data.type === "Premium") q = q.gt("price", 0);
    if (data.price === "Under $20") q = q.gt("price", 0).lt("price", 20);
    if (data.price === "$20–$50") q = q.gte("price", 20).lte("price", 50);
    if (data.price === "$50+") q = q.gt("price", 50);
    if (data.rating === "4.5+") q = q.gte("rating", 4.5);
    if (data.rating === "4.8+") q = q.gte("rating", 4.8);
    if (data.rating === "5.0") q = q.gte("rating", 5.0);

    switch (data.sort) {
      case "Newest":
        q = q.order("is_new", { ascending: false }).order("created_at", { ascending: false });
        break;
      case "Best selling":
        q = q.order("reviews", { ascending: false });
        break;
      case "Highest rated":
        q = q.order("rating", { ascending: false });
        break;
      case "Lowest price":
        q = q.order("price", { ascending: true });
        break;
      case "Highest price":
        q = q.order("price", { ascending: false });
        break;
      default:
        q = q.order("featured", { ascending: false }).order("reviews", { ascending: false });
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows as Row[]).map(toAsset);
  });

export const getAssetBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const { data: row, error } = await supabase
      .from("assets")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    const asset = toAsset(row as Row);

    const { data: creator } = await supabase
      .from("creators")
      .select("*")
      .eq("handle", asset.handle)
      .maybeSingle();

    const { data: related } = await supabase
      .from("assets")
      .select("*")
      .eq("category", asset.category)
      .neq("id", asset.id)
      .limit(4);

    const { data: moreFrom } = await supabase
      .from("assets")
      .select("*")
      .eq("handle", asset.handle)
      .neq("id", asset.id)
      .limit(4);

    return {
      asset,
      creator: creator ?? null,
      related: (related ?? []).map((r) => toAsset(r as Row)),
      moreFrom: (moreFrom ?? []).map((r) => toAsset(r as Row)),
    };
  });
