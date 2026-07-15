import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// -------- helpers --------
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `asset-${Date.now().toString(36)}`;
}

const createInput = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(4000).optional().default(""),
  category: z.string().trim().min(1).max(80),
  kind: z.string().trim().min(1).max(40),
  software: z.array(z.string().trim().min(1).max(40)).max(20).optional().default([]),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional().default([]),
  price: z.number().min(0).max(9999),
  originalPrice: z.number().min(0).max(9999).optional().nullable(),
  version: z.string().trim().max(30).optional().default("1.0.0"),
  size: z.string().trim().max(30).optional().default(""),
  tint: z.enum(["cyan", "magenta", "amber"]).optional().default("cyan"),
  img_url: z.string().trim().max(1000).optional().default(""),
  img_key: z.string().trim().max(40).optional().default("lightleaks"),
  status: z.enum(["draft", "published"]).optional().default("draft"),
});

export const createMyAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createInput.parse(input))
  .handler(async ({ context, data }) => {
    // Look up creator identity from profile
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("handle, display_name")
      .eq("id", context.userId)
      .maybeSingle();

    const handle = profile?.handle || `user-${context.userId.slice(0, 8)}`;
    const creator = profile?.display_name || handle;

    const baseSlug = slugify(data.title);
    const id = `u_${context.userId.slice(0, 8)}_${Date.now().toString(36)}`;
    const slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

    const row = {
      id,
      slug,
      owner_id: context.userId,
      title: data.title,
      description: data.description ?? "",
      category: data.category,
      kind: data.kind.toUpperCase(),
      tc: "00:00:00:00",
      creator,
      handle,
      price: data.price,
      original_price: data.originalPrice ?? null,
      software: data.software ?? [],
      tags: data.tags ?? [],
      version: data.version ?? "1.0.0",
      size: data.size ?? "",
      tint: data.tint ?? "cyan",
      img_key: data.img_key || "lightleaks",
      img_url: data.img_url ?? "",
      status: data.status ?? "draft",
      updated: "just now",
      is_new: true,
    };

    const { data: inserted, error } = await context.supabase
      .from("assets")
      .insert(row)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return inserted;
  });

const updateInput = createInput.partial().extend({ id: z.string().min(1) });

export const updateMyAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => updateInput.parse(input))
  .handler(async ({ context, data }) => {
    const { id, ...rest } = data;
    const patch: Record<string, unknown> = { ...rest };
    if (rest.kind) patch.kind = rest.kind.toUpperCase();
    if ("originalPrice" in rest) {
      patch.original_price = rest.originalPrice ?? null;
      delete (patch as Record<string, unknown>).originalPrice;
    }
    const { error } = await context.supabase
      .from("assets")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(patch as any)
      .eq("id", id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMyAsset = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("assets")
      .delete()
      .eq("id", data.id)
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyAssets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("assets")
      .select(
        "id, slug, title, kind, category, price, rating, reviews, downloads, status, img_key, img_url, tint, version, created_at",
      )
      .eq("owner_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getMyDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("assets")
      .select("status, rating, reviews, downloads")
      .eq("owner_id", context.userId);
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    const published = rows.filter((r) => r.status === "published").length;
    const drafts = rows.filter((r) => r.status === "draft").length;
    const reviews = rows.reduce((s, r) => s + Number(r.reviews ?? 0), 0);
    const avgRating =
      rows.length === 0
        ? 0
        : rows.reduce((s, r) => s + Number(r.rating ?? 0), 0) / rows.length;
    // downloads is stored as a display string; parse leading number when possible
    const totalDownloads = rows.reduce((s, r) => {
      const raw = String(r.downloads ?? "0").replace(/,/g, "");
      const m = raw.match(/([\d.]+)\s*([kKmM]?)/);
      if (!m) return s;
      const n = parseFloat(m[1]);
      const mult = m[2].toLowerCase() === "k" ? 1_000 : m[2].toLowerCase() === "m" ? 1_000_000 : 1;
      return s + (isNaN(n) ? 0 : n * mult);
    }, 0);
    return {
      total: rows.length,
      published,
      drafts,
      reviews,
      avgRating,
      totalDownloads,
    };
  });
