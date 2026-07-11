import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import type { Asset, Tint } from "@/lib/mock";

// --- atoms ---
export function Verified({ tint = "cyan" }: { tint?: Tint }) {
  return (
    <span
      title="Verified creator"
      className="inline-flex h-4 w-4 items-center justify-center rounded-full"
      style={{ background: `color-mix(in oklab, var(--${tint}) 30%, transparent)`, border: `1px solid var(--${tint})` }}
    >
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
        <path d="M2 6.2 4.6 8.8 10 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

export function Stars({ value, showValue = true }: { value: number; showValue?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[color:var(--foreground)]">
      <span className="text-[color:var(--amber)]">★</span>
      {showValue && value.toFixed(1)}
    </span>
  );
}

export function Chip({ children, tint }: { children: ReactNode; tint?: Tint }) {
  return (
    <span
      className="inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
      style={{
        borderColor: tint ? `color-mix(in oklab, var(--${tint}) 60%, transparent)` : "var(--hairline)",
        color: tint ? `var(--${tint})` : "var(--mute)",
      }}
    >
      {tint && <span className="h-1 w-1" style={{ background: `var(--${tint})` }} />}
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
      {children}
    </div>
  );
}

export function CreatorAvatar({ tint, size = 40 }: { tint: Tint; size?: number }) {
  return (
    <span
      className="inline-block rounded-full border"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--${tint}) 55%, transparent), var(--surface-2))`,
        borderColor: `color-mix(in oklab, var(--${tint}) 60%, transparent)`,
      }}
    />
  );
}

// --- search ---
const suggestions = [
  "anamorphic light leaks","film grain 4k","kodak portra preset","cinematic transitions AE",
  "whoosh sfx pack","resolve LUT filmic","blender studio hdri","streetwear png cutouts",
];

export function SearchBar({ big = false }: { big?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(
    () => (q ? suggestions.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : suggestions.slice(0, 6)),
    [q],
  );
  return (
    <div className={"relative " + (big ? "w-full" : "w-full max-w-md")}>
      <label className="sr-only" htmlFor="site-search">Search assets</label>
      <div className={"flex items-center gap-3 border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 backdrop-blur px-4 " + (big ? "h-14" : "h-10")}>
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-[color:var(--mute)]" aria-hidden>
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
        <input
          id="site-search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder="Search 14,382 assets — LUTs, overlays, SFX, presets…"
          className={"flex-1 bg-transparent outline-none placeholder:text-[color:var(--mute)] " + (big ? "text-base" : "text-sm")}
        />
        <span className="hidden md:inline font-mono text-[10px] tracking-widest text-[color:var(--mute)] border border-[color:var(--hairline)] px-1.5 py-0.5">/</span>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-1 border border-[color:var(--hairline)] bg-[color:var(--surface)]/95 backdrop-blur">
          <div className="px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)] border-b border-[color:var(--hairline)]">
            {q ? "matches" : "trending searches"}
          </div>
          <ul className="max-h-72 overflow-auto">
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-[color:var(--mute)]">Nothing here. Try "grain", "whoosh", or "portra".</li>
            )}
            {results.map((r) => (
              <li key={r}>
                <Link
                  to="/marketplace"
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-[color:var(--surface-2)]"
                >
                  <span>{r}</span>
                  <span className="font-mono text-[10px] text-[color:var(--mute)]">↵</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --- ticker ---
export function Ticker() {
  const items = [
    "287 new assets this week","Payouts open in 42 currencies","Free SFX pack — updated today",
    "Regional pricing rolling out to 14 markets","Krystl · 12.4k downloads on Light Leaks Vol.02",
    "Creator payouts every Friday",
  ];
  return (
    <div className="relative overflow-hidden border-b border-[color:var(--hairline)] bg-[color:var(--ink)]">
      <div className="flex whitespace-nowrap ticker-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 gap-10 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--mute)]">
            {items.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] live-dot" />
                {it}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- header ---
const NAV: Array<[string, string]> = [
  ["Marketplace", "/marketplace"],
  ["Creators", "/creators"],
  ["Categories", "/categories"],
  ["Free", "/free"],
  ["Sell", "/dashboard"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[color:color-mix(in_oklab,var(--background)_82%,transparent)] border-b border-[color:var(--hairline)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[color:var(--amber)] shadow-[0_0_12px_var(--amber)] live-dot" />
          <span className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--mute)]">
            REC · KRYSTLASSETS
          </span>
        </Link>
        <nav className="ml-4 hidden gap-6 lg:flex">
          {NAV.map(([l, h]) => (
            <Link key={l} to={h} className="hair-link text-sm">{l}</Link>
          ))}
        </nav>
        <div className="ml-auto hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>
        <div className="flex items-center gap-3">
          <Link to="/wishlist" title="Wishlist" className="hidden sm:inline-flex h-9 w-9 items-center justify-center border border-[color:var(--hairline)] hover:border-[color:var(--cyan)]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden><path d="M10 17s-6-4-6-9a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 5-6 9-6 9z" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>
          </Link>
          <Link to="/cart" title="Cart" className="relative inline-flex h-9 w-9 items-center justify-center border border-[color:var(--hairline)] hover:border-[color:var(--amber)]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden><path d="M3 4h2l1.6 8.6a2 2 0 0 0 2 1.6h5.8a2 2 0 0 0 2-1.5L18 6H6" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>
            <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-[color:var(--amber)] px-1 font-mono text-[9px] leading-4 text-[color:var(--ink)]">2</span>
          </Link>
          <Link to="/auth" className="hair-link hidden sm:inline-block text-sm text-[color:var(--mute)] hover:text-foreground">
            Sign in
          </Link>
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] transition-colors hover:bg-transparent hover:text-[color:var(--amber)]"
          >
            <span className="h-1.5 w-1.5 bg-[color:var(--ink)] group-hover:bg-[color:var(--amber)]" />
            Sell
          </Link>
        </div>
      </div>
    </header>
  );
}

// --- footer ---
export function Footer() {
  const cols = [
    { title: "Marketplace", links: [["Browse","/marketplace"],["Categories","/categories"],["Creators","/creators"],["Free assets","/free"],["Deals","/deals"]] },
    { title: "Sell", links: [["Creator dashboard","/dashboard"],["Upload","/dashboard/upload"],["Creator program","/creator-program"],["Payouts","/dashboard"],["Analytics","/dashboard"]] },
    { title: "Support", links: [["Documentation","/docs"],["Licensing","/licensing"],["Support","/support"],["API","/api"],["Status","/status"]] },
    { title: "Company", links: [["About","/about"],["Terms","/terms"],["Privacy","/privacy"],["Discord","/discord"],["YouTube","/youtube"],["Instagram","/instagram"]] },
  ];
  return (
    <footer className="mt-24 border-t border-[color:var(--hairline)] bg-[color:var(--ink)]">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:grid-cols-6">
        <div className="md:col-span-2">
          <div className="font-display text-3xl tracking-tight">
            krystl<span className="text-[color:var(--cyan)]">assets</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-[color:var(--mute)]">
            The marketplace for editors and creators. Overlays, LUTs, SFX, presets and motion — built in a real timeline.
          </p>
          <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
            © {new Date().getFullYear()} Krystlassets · v02
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// {c.title}</div>
            <ul className="space-y-2 text-sm">
              {c.links.map(([l, h]) => (
                <li key={l}><Link to={h as string} className="hair-link">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}

// --- page shell ---
export function Shell({ children, noTicker = false }: { children: ReactNode; noTicker?: boolean }) {
  return (
    <>
      {!noTicker && <Ticker />}
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// --- asset card ---
export function AssetCard({ a }: { a: Asset }) {
  const priceLabel = a.price === 0 ? "Free" : `$${a.price}`;
  return (
    <Link
      to="/asset/$slug"
      params={{ slug: a.slug }}
      className="clip-card group block border border-[color:var(--hairline)] bg-[color:var(--surface)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={a.img}
          alt={a.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 scanlines" />
        <div className="absolute left-3 top-3 flex items-center gap-2 bg-[color:var(--ink)]/70 px-2 py-1 font-mono text-[10px] tracking-wider text-[color:var(--foreground)] backdrop-blur">
          <span className="h-1.5 w-1.5" style={{ background: `var(--${a.tint})` }} />
          {a.tc}
        </div>
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.22em]">
          <span className="text-[color:var(--foreground)]/80">{a.kind}</span>
          {a.flashDeal && <span className="bg-[color:var(--magenta)] px-1.5 py-0.5 text-[color:white]">−{Math.round(100 - (a.price/(a.originalPrice||a.price))*100)}%</span>}
          {a.new && !a.flashDeal && <span className="bg-[color:var(--cyan)] px-1.5 py-0.5 text-[color:var(--ink)]">NEW</span>}
          {a.staffPick && !a.flashDeal && !a.new && <span className="bg-[color:var(--amber)] px-1.5 py-0.5 text-[color:var(--ink)]">STAFF</span>}
        </div>
        <div
          className="waveform absolute inset-x-0 bottom-0 h-6 opacity-60"
          style={{ ["--wf-color" as string]: `var(--${a.tint})` }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">{a.title}</h3>
          <div className="shrink-0 text-right">
            {a.originalPrice && (
              <div className="font-mono text-[10px] text-[color:var(--mute)] line-through">${a.originalPrice}</div>
            )}
            <span className={"font-mono text-sm " + (a.price === 0 ? "text-[color:var(--cyan)]" : "text-[color:var(--foreground)]")}>
              {priceLabel}
            </span>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[color:var(--mute)]">
          <CreatorAvatar tint={a.tint} size={16} />
          <span>{a.creator}</span>
          <span className="text-[color:var(--mute)]/60">·</span>
          <Stars value={a.rating} />
          <span className="text-[color:var(--mute)]/60">·</span>
          <span>{a.downloads} dl</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
          {a.software.slice(0, 3).map((s) => (
            <span key={s} className="border border-[color:var(--hairline)] px-1.5 py-0.5">{s}</span>
          ))}
          <span className="ml-auto text-[color:var(--mute)]/80">upd {a.updated}</span>
        </div>
      </div>
    </Link>
  );
}

export function AssetGrid({ items }: { items: Asset[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((a) => <AssetCard key={a.id} a={a} />)}
    </div>
  );
}

// --- filter bar ---
type FilterKey = "software" | "category" | "price" | "rating" | "type" | "resolution" | "sort";
export type Filters = Record<FilterKey, string>;
export const defaultFilters: Filters = {
  software: "All", category: "All", price: "Any", rating: "Any", type: "All", resolution: "Any", sort: "Trending",
};

export function FilterBar({ value, onChange }: { value: Filters; onChange: (f: Filters) => void }) {
  const groups: Array<{ key: FilterKey; label: string; options: string[] }> = [
    { key: "software", label: "Software", options: ["All","Premiere","AE","Resolve","FCP","Blender","Photoshop","Lightroom"] },
    { key: "category", label: "Category", options: ["All","Overlays","LUTs","SFX","Presets","Motion Graphics","3D Assets","Transitions","PNG"] },
    { key: "price", label: "Price", options: ["Any","Free","Under $20","$20–$50","$50+"] },
    { key: "rating", label: "Rating", options: ["Any","4.5+","4.8+","5.0"] },
    { key: "resolution", label: "Resolution", options: ["Any","HD","4K","6K+"] },
    { key: "type", label: "Type", options: ["All","Free","Premium"] },
    { key: "sort", label: "Sort", options: ["Trending","Newest","Best selling","Highest rated","Lowest price","Highest price","Recently updated"] },
  ];
  return (
    <div className="border-y border-[color:var(--hairline)] bg-[color:var(--surface)]/40">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-6 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)] shrink-0">// filters</span>
        {groups.map((g) => (
          <label key={g.key} className="group relative shrink-0">
            <span className="sr-only">{g.label}</span>
            <select
              value={value[g.key]}
              onChange={(e) => onChange({ ...value, [g.key]: e.target.value })}
              className="appearance-none bg-transparent border border-[color:var(--hairline)] pl-3 pr-8 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--foreground)] hover:border-[color:var(--cyan)] focus:border-[color:var(--cyan)] focus:outline-none"
            >
              {g.options.map((o) => (
                <option key={o} value={o} className="bg-[color:var(--surface)] text-[color:var(--foreground)]">
                  {g.label}: {o}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[color:var(--mute)]">▾</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function applyFilters(items: Asset[], f: Filters): Asset[] {
  let r = [...items];
  if (f.software !== "All") r = r.filter(a => a.software.some(s => s.toLowerCase().includes(f.software.toLowerCase())));
  if (f.category !== "All") r = r.filter(a => a.category === f.category);
  if (f.type === "Free") r = r.filter(a => a.price === 0);
  if (f.type === "Premium") r = r.filter(a => a.price > 0);
  if (f.price === "Free") r = r.filter(a => a.price === 0);
  if (f.price === "Under $20") r = r.filter(a => a.price > 0 && a.price < 20);
  if (f.price === "$20–$50") r = r.filter(a => a.price >= 20 && a.price <= 50);
  if (f.price === "$50+") r = r.filter(a => a.price > 50);
  if (f.rating === "4.5+") r = r.filter(a => a.rating >= 4.5);
  if (f.rating === "4.8+") r = r.filter(a => a.rating >= 4.8);
  if (f.rating === "5.0") r = r.filter(a => a.rating >= 5.0);
  switch (f.sort) {
    case "Newest": r.sort((a,b) => Number(!!b.new) - Number(!!a.new)); break;
    case "Best selling": r.sort((a,b) => b.reviews - a.reviews); break;
    case "Highest rated": r.sort((a,b) => b.rating - a.rating); break;
    case "Lowest price": r.sort((a,b) => a.price - b.price); break;
    case "Highest price": r.sort((a,b) => b.price - a.price); break;
    default: break;
  }
  return r;
}

// --- page header ---
export function PageHeader({ eyebrow, title, sub, right }: { eyebrow: string; title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-8">
      <SectionLabel>{eyebrow}</SectionLabel>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="max-w-3xl font-display text-4xl md:text-6xl font-semibold leading-[0.95] tracking-tight">{title}</h1>
        {right}
      </div>
      {sub && <p className="mt-4 max-w-2xl text-[color:var(--foreground)]/80">{sub}</p>}
    </div>
  );
}
