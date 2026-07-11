import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader, AssetGrid } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const items = assets.slice(0, 3);
  return (
    <Shell>
      <PageHeader eyebrow="// account · wishlist" title={<>Saved for the next timeline.</>} />
      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="mb-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
          <span>{items.length} items</span>
          <div className="flex gap-3">
            <button className="hair-link">Move all to cart</button>
            <button className="hair-link text-[color:var(--mute)]">Clear</button>
          </div>
        </div>
        {items.length === 0 ? (
          <div className="border border-dashed border-[color:var(--hairline)] p-16 text-center">
            <div className="font-display text-2xl">Nothing saved.</div>
            <p className="mt-2 text-[color:var(--mute)]">Tap the heart on any asset to keep it here.</p>
            <Link to="/marketplace" className="mt-6 inline-block border border-[color:var(--cyan)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">Browse marketplace</Link>
          </div>
        ) : <AssetGrid items={items} />}
      </div>
    </Shell>
  );
}
