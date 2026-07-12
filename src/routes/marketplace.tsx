import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, queryOptions, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Shell, AssetGrid, FilterBar, defaultFilters, PageHeader, type Filters } from "@/components/site";
import { listAssets } from "@/lib/catalog.functions";
import { withImg } from "@/lib/img";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/marketplace")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Marketplace — Krystlassets" },
      { name: "description", content: "Search overlays, LUTs, SFX, presets, motion and 3D built by editors." },
      { property: "og:title", content: "Marketplace — Krystlassets" },
      { property: "og:description", content: "Every pack a working editor actually reaches for." },
    ],
  }),
  component: MarketplacePage,
  errorComponent: ({ error }) => (
    <Shell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// marketplace · error</div>
        <h1 className="mt-4 font-display text-4xl">The catalog didn't load.</h1>
        <p className="mt-4 font-mono text-sm text-[color:var(--mute)]">{error.message}</p>
      </div>
    </Shell>
  ),
  notFoundComponent: () => null,
});

function marketplaceQuery(fn: ReturnType<typeof useServerFn<typeof listAssets>>, args: Record<string, unknown>) {
  return queryOptions({
    queryKey: ["assets", args],
    queryFn: async () => {
      const rows = await fn({ data: args });
      return rows.map(withImg);
    },
    staleTime: 30_000,
  });
}

function MarketplacePage() {
  const search = Route.useSearch();
  const router = useRouter();
  const list = useServerFn(listAssets);
  const qc = useQueryClient();

  const [f, setF] = useState<Filters>(defaultFilters);
  const [term, setTerm] = useState(search.q ?? "");

  const args = {
    q: search.q,
    category: f.category,
    software: f.software,
    price: f.price,
    rating: f.rating,
    type: f.type,
    sort: f.sort,
  };
  const { data: results = [], isFetching } = useQuery(marketplaceQuery(list, args));

  const submitSearch = (v: string) => {
    router.navigate({ to: "/marketplace", search: v ? { q: v } : {} });
    qc.invalidateQueries({ queryKey: ["assets"] });
  };

  return (
    <Shell>
      <PageHeader
        eyebrow="// marketplace · live catalog"
        title={<>Every pack a working editor <em className="not-italic text-[color:var(--cyan)]">actually</em> reaches for.</>}
        sub="Search, filter and sort a catalog built by editors, for editors. Buy once, keep forever, redownload anytime."
        right={
          <form
            onSubmit={(e) => { e.preventDefault(); submitSearch(term.trim()); }}
            className="flex w-full items-center gap-2 border border-[color:var(--hairline)] bg-[color:var(--surface)] px-3 py-2 md:w-[420px]"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">/</span>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="search — light leaks, kodak, whoosh…"
              className="w-full bg-transparent font-mono text-[12px] text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--mute)]"
              aria-label="Search marketplace"
            />
            {term && (
              <button type="button" onClick={() => { setTerm(""); submitSearch(""); }} className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)] hover:text-[color:var(--foreground)]">clear</button>
            )}
          </form>
        }
      />
      <FilterBar value={f} onChange={setF} />
      <section className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
          <span>
            {isFetching ? "loading…" : `${results.length} result${results.length === 1 ? "" : "s"}`}
            {search.q ? <> for “<span className="text-[color:var(--foreground)]">{search.q}</span>”</> : null}
          </span>
          <span>sort: {f.sort}</span>
        </div>
        {results.length === 0 && !isFetching ? (
          <div className="border border-dashed border-[color:var(--hairline)] p-16 text-center">
            <div className="font-display text-2xl">No matches on this timeline.</div>
            <p className="mt-2 text-[color:var(--mute)]">Loosen a filter, clear the search, or try a different term.</p>
            <button onClick={() => { setF(defaultFilters); setTerm(""); submitSearch(""); }} className="mt-6 border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">Reset</button>
          </div>
        ) : (
          <AssetGrid items={results} />
        )}
      </section>
    </Shell>
  );
}
