import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- profile ----------
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const profileInput = z.object({
  handle: z.string().trim().min(2).max(40).regex(/^[a-zA-Z0-9_-]+$/, "letters, numbers, _ or -").optional(),
  display_name: z.string().trim().max(80).optional(),
  bio: z.string().trim().max(400).optional(),
  avatar_url: z.string().trim().max(500).optional(),
  mode: z.enum(["buyer", "seller"]).optional(),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileInput.parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- cart & wishlist ----------
export type AssetRow = {
  id: string; slug: string; title: string; creator: string; handle: string;
  kind: string; tc: string; price: number; original_price: number | null;
  rating: number; reviews: number; downloads: string; size: string;
  software: string[]; updated: string; version: string; img_key: string;
  tint: string; category: string; tags: string[]; featured: boolean;
  staff_pick: boolean; best_seller: boolean; is_new: boolean; flash_deal: boolean;
};

const ASSET_COLS =
  "id, slug, title, creator, handle, kind, tc, price, original_price, rating, reviews, downloads, size, software, updated, version, img_key, tint, category, tags, featured, staff_pick, best_seller, is_new, flash_deal";

function normalizeAsset(a: unknown): AssetRow {
  const r = a as Record<string, unknown>;
  return {
    id: String(r.id), slug: String(r.slug), title: String(r.title),
    creator: String(r.creator), handle: String(r.handle), kind: String(r.kind),
    tc: String(r.tc), price: Number(r.price),
    original_price: r.original_price == null ? null : Number(r.original_price),
    rating: Number(r.rating), reviews: Number(r.reviews),
    downloads: String(r.downloads), size: String(r.size),
    software: (r.software as string[]) ?? [], updated: String(r.updated),
    version: String(r.version), img_key: String(r.img_key), tint: String(r.tint),
    category: String(r.category), tags: (r.tags as string[]) ?? [],
    featured: Boolean(r.featured), staff_pick: Boolean(r.staff_pick),
    best_seller: Boolean(r.best_seller), is_new: Boolean(r.is_new),
    flash_deal: Boolean(r.flash_deal),
  };
}

export const getMyCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("cart_items")
      .select(`id, qty, asset_id, assets(${ASSET_COLS})`)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => {
      const row = r as unknown as { id: string; qty: number; asset_id: string; assets: unknown };
      return { id: row.id, qty: row.qty, asset_id: row.asset_id, asset: normalizeAsset(row.assets) };
    });
  });

export const addToCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ asset_id: z.string().min(1) }).parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("cart_items")
      .upsert(
        { user_id: context.userId, asset_id: data.asset_id, qty: 1 },
        { onConflict: "user_id,asset_id", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeFromCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ asset_id: z.string().min(1) }).parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", context.userId)
      .eq("asset_id", data.asset_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyWishlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("wishlist_items")
      .select(`id, asset_id, assets(${ASSET_COLS})`)
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => {
      const row = r as unknown as { id: string; asset_id: string; assets: unknown };
      return { id: row.id, asset_id: row.asset_id, asset: normalizeAsset(row.assets) };
    });
  });

export const toggleWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ asset_id: z.string().min(1) }).parse(input))
  .handler(async ({ context, data }) => {
    const { data: existing } = await context.supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", context.userId)
      .eq("asset_id", data.asset_id)
      .maybeSingle();
    if (existing) {
      const { error } = await context.supabase.from("wishlist_items").delete().eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { saved: false };
    }
    const { error } = await context.supabase
      .from("wishlist_items")
      .insert({ user_id: context.userId, asset_id: data.asset_id });
    if (error) throw new Error(error.message);
    return { saved: true };
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ asset_id: z.string().min(1) }).parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", context.userId)
      .eq("asset_id", data.asset_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
