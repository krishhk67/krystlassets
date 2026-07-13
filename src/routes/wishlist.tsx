import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shell, PageHeader, AssetCard } from "@/components/site";
import { getMyWishlist, removeFromWishlist, addToCart } from "@/lib/user.functions";
import { resolveImg } from "@/lib/img";
import { useSession } from "@/hooks/useSession";
import type { Asset, Tint } from "@/lib/mock";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: WishlistPage,
});

function toAsset(a: {
  id: string; slug: string; title: string; creator: string; handle: string;
  kind: string; tc: string; price: number; original_price: number | null;
  rating: number; reviews: number; downloads: string; size: string;
  software: string[]; updated: string; version: string; img_key: string;
  tint: string; category: string; tags: string[]; featured: boolean;
  staff_pick: boolean; best_seller: boolean; is_new: boolean; flash_deal: boolean;
}): Asset {
  return {
    id: a.id, slug: a.slug, title: a.title, creator: a.creator, handle: a.handle,
    kind: a.kind, tc: a.tc, price: a.price,
    originalPrice: a.original_price ?? undefined, rating: a.rating, reviews: a.reviews,
    downloads: a.downloads, size: a.size, software: a.software, updated: a.updated,
    version: a.version, img: resolveImg(a.img_key), tint: (a.tint as Tint),
    category: a.category, tags: a.tags, featured: a.featured,
    staffPick: a.staff_pick, bestSeller: a.best_seller, new: a.is_new,
    flashDeal: a.flash_deal,
  };
}

function WishlistPage() {
  const { isAuthed, loading } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const wishlist = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getMyWishlist(),
    enabled: isAuthed,
  });

  const remove = useMutation({
    mutationFn: (asset_id: string) => removeFromWishlist({ data: { asset_id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
  const moveAll = useMutation({
    mutationFn: async () => {
      const items = wishlist.data ?? [];
      await Promise.all(items.map((i) => addToCart({ data: { asset_id: i.asset_id } })));
      await Promise.all(items.map((i) => removeFromWishlist({ data: { asset_id: i.asset_id } })));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Moved to cart");
    },
  });

  if (!loading && !isAuthed) {
    return (
      <Shell>
        <PageHeader eyebrow="// account · wishlist" title={<>Sign in to save assets.</>} />
        <div className="mx-auto max-w-[900px] px-6 pb-24 text-center">
          <p className="text-[color:var(--foreground)]/80">Tap the heart on any asset once you're in. It follows you across devices.</p>
          <button onClick={() => navigate({ to: "/auth" })} className="mt-6 inline-block bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]">
            Sign in →
          </button>
        </div>
      </Shell>
    );
  }

  const items = (wishlist.data ?? []).map((w) => ({ id: w.id, asset_id: w.asset_id, asset: toAsset(w.asset) }));

  return (
    <Shell>
      <PageHeader eyebrow="// account · wishlist" title={<>Saved for the next timeline.</>} />
      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
          <span>{items.length} items</span>
          <div className="flex gap-3">
            <button onClick={() => moveAll.mutate()} disabled={items.length === 0 || moveAll.isPending} className="hair-link disabled:opacity-40">Move all to cart</button>
          </div>
        </div>
        {wishlist.isLoading ? (
          <div className="p-8 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">Loading wishlist...</div>
        ) : items.length === 0 ? (
          <div className="border border-dashed border-[color:var(--hairline)] p-16 text-center">
            <div className="font-display text-2xl">Nothing saved.</div>
            <p className="mt-2 text-[color:var(--mute)]">Tap the heart on any asset to keep it here.</p>
            <Link to="/marketplace" className="mt-6 inline-block border border-[color:var(--cyan)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">Browse marketplace</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((w) => (
              <div key={w.id} className="relative">
                <AssetCard a={w.asset} />
                <button
                  onClick={() => remove.mutate(w.asset_id)}
                  className="absolute right-3 top-3 z-10 border border-[color:var(--hairline)] bg-[color:var(--ink)]/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--magenta)] hover:text-[color:var(--magenta)]"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
