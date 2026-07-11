import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, AssetGrid } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/deals")({
  head: () => ({ meta: [{ title: "Flash deals — Krystlassets" }, { name: "description", content: "Limited-time discounts on premium assets." }] }),
  component: DealsPage,
});

function DealsPage() {
  const items = assets.filter(a => a.flashDeal || a.originalPrice);
  return (
    <Shell>
      <PageHeader
        eyebrow="// deals · flash · 48h"
        title={<>The timer's <em className="not-italic text-[color:var(--magenta)]">running</em>.</>}
        sub="Curated discounts, refreshed every Monday. When it's gone, it's gone."
        right={<div className="font-mono text-sm text-[color:var(--magenta)]">Ends in 23:14:07</div>}
      />
      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        {items.length > 0 ? <AssetGrid items={items} /> : <div className="text-[color:var(--mute)]">No deals right now. Check back Monday.</div>}
      </div>
    </Shell>
  );
}
