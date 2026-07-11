import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell, AssetGrid, FilterBar, applyFilters, defaultFilters, PageHeader } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Krystlassets" },
      { name: "description", content: "Browse 14,382 assets for editors and creators. Overlays, LUTs, SFX, presets, motion, 3D." },
      { property: "og:title", content: "Marketplace — Krystlassets" },
      { property: "og:description", content: "Browse 14,382 assets for editors and creators." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [f, setF] = useState(defaultFilters);
  const results = useMemo(() => applyFilters(assets, f), [f]);
  return (
    <Shell>
      <PageHeader
        eyebrow="// marketplace · 14,382 assets · updated live"
        title={<>Every pack a working editor <em className="not-italic text-[color:var(--cyan)]">actually</em> reaches for.</>}
        sub="Search, filter and sort a catalog built by editors, for editors. Buy once, keep forever, redownload anytime."
      />
      <FilterBar value={f} onChange={setF} />
      <section className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
          <span>{results.length} results</span>
          <span>sort: {f.sort}</span>
        </div>
        {results.length === 0 ? (
          <div className="border border-dashed border-[color:var(--hairline)] p-16 text-center">
            <div className="font-display text-2xl">No matches on this timeline.</div>
            <p className="mt-2 text-[color:var(--mute)]">Loosen a filter, or try a different search.</p>
            <button onClick={() => setF(defaultFilters)} className="mt-6 border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">Reset filters</button>
          </div>
        ) : (
          <AssetGrid items={results} />
        )}
      </section>
    </Shell>
  );
}
