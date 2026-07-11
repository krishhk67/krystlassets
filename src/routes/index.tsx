import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import lightleaks from "@/assets/pack-lightleaks.jpg";
import glitch from "@/assets/pack-glitch.jpg";
import sfx from "@/assets/pack-sfx.jpg";
import luts from "@/assets/pack-luts.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

// ---------------- Data ----------------

type Tint = "cyan" | "magenta" | "amber";

type Asset = {
  id: string;
  tc: string;
  kind: string;
  title: string;
  creator: string;
  handle: string;
  price: string;
  rating: number;
  downloads: string;
  size: string;
  software: string[];
  updated: string;
  img: string;
  tint: Tint;
};

const assets: Asset[] = [
  {
    id: "a01", tc: "00:04:12:03", kind: "OVERLAYS",
    title: "Anamorphic Light Leaks — Vol.02",
    creator: "Krystl", handle: "@krystl",
    price: "$28", rating: 4.9, downloads: "12.4k", size: "3.8 GB",
    software: ["Premiere", "Resolve", "AE"], updated: "2d ago",
    img: lightleaks, tint: "cyan",
  },
  {
    id: "a02", tc: "00:02:47:18", kind: "TRANSITIONS",
    title: "RGB Split & Datamosh Kit",
    creator: "Nine Volt", handle: "@ninevolt",
    price: "$34", rating: 4.8, downloads: "9.1k", size: "1.2 GB",
    software: ["AE", "Premiere"], updated: "5d ago",
    img: glitch, tint: "magenta",
  },
  {
    id: "a03", tc: "00:11:03:00", kind: "SFX",
    title: "Whooshes, Risers, Impacts",
    creator: "Room 8", handle: "@room8",
    price: "$22", rating: 4.9, downloads: "22.7k", size: "640 MB",
    software: ["Any DAW"], updated: "1w ago",
    img: sfx, tint: "amber",
  },
  {
    id: "a04", tc: "00:00:24:00", kind: "LUTS",
    title: "Filmic Teal / Sodium Pack",
    creator: "Halide Co.", handle: "@halide",
    price: "$18", rating: 4.7, downloads: "18.3k", size: "42 MB",
    software: ["Resolve", "Premiere", "FCP"], updated: "3d ago",
    img: luts, tint: "magenta",
  },
  {
    id: "a05", tc: "00:07:19:12", kind: "MOTION",
    title: "Broadcast Titles / Lower Thirds",
    creator: "Sable Studio", handle: "@sable",
    price: "Free", rating: 4.8, downloads: "31.0k", size: "220 MB",
    software: ["AE", "MOGRT"], updated: "yesterday",
    img: glitch, tint: "cyan",
  },
  {
    id: "a06", tc: "00:03:02:07", kind: "PRESETS",
    title: "Kodak Portra Emulation",
    creator: "Umbra", handle: "@umbra",
    price: "$14", rating: 4.9, downloads: "7.6k", size: "18 MB",
    software: ["Photoshop", "Lightroom"], updated: "6d ago",
    img: luts, tint: "amber",
  },
  {
    id: "a07", tc: "00:05:44:22", kind: "3D",
    title: "Volumetric Studio Rig",
    creator: "Foglamp", handle: "@foglamp",
    price: "$48", rating: 5.0, downloads: "2.4k", size: "6.1 GB",
    software: ["Blender", "C4D"], updated: "4d ago",
    img: lightleaks, tint: "cyan",
  },
  {
    id: "a08", tc: "00:00:12:08", kind: "PNG",
    title: "Cutout — Streetwear Archive",
    creator: "Paperlane", handle: "@paperlane",
    price: "$9", rating: 4.6, downloads: "5.2k", size: "310 MB",
    software: ["Photoshop", "Figma"], updated: "8h ago",
    img: sfx, tint: "magenta",
  },
];

const creators = [
  { name: "Krystl",    handle: "@krystl",    followers: "48.2k", sales: "$182k", rating: 4.9, verified: true,  tint: "magenta" as const },
  { name: "Nine Volt", handle: "@ninevolt",  followers: "22.7k", sales: "$96k",  rating: 4.8, verified: true,  tint: "cyan" as const },
  { name: "Halide Co.",handle: "@halide",    followers: "18.4k", sales: "$74k",  rating: 4.7, verified: true,  tint: "amber" as const },
  { name: "Foglamp",   handle: "@foglamp",   followers: "9.1k",  sales: "$38k",  rating: 5.0, verified: false, tint: "cyan" as const },
];

const categories = [
  { label: "After Effects", n: "1.2k" },
  { label: "Premiere Pro",  n: "980" },
  { label: "DaVinci Resolve", n: "742" },
  { label: "Photoshop",     n: "1.6k" },
  { label: "Blender",       n: "418" },
  { label: "LUTs",          n: "612" },
  { label: "Presets",       n: "829" },
  { label: "Overlays",      n: "1.1k" },
  { label: "SFX",           n: "2.4k" },
  { label: "PNG",           n: "3.8k" },
  { label: "Motion Graphics", n: "560" },
  { label: "3D Assets",     n: "302" },
];

const suggestions = [
  "anamorphic light leaks",
  "film grain 4k",
  "kodak portra preset",
  "cinematic transitions AE",
  "whoosh sfx pack",
  "resolve LUT filmic",
  "blender studio hdri",
  "streetwear png cutouts",
];

const stats = [
  { k: "14,382", v: "Assets" },
  { k: "3,914",  v: "Creators" },
  { k: "2.4M",   v: "Downloads" },
  { k: "104",    v: "Countries" },
  { k: "+287",   v: "New this week" },
];

// --------------- Small UI atoms ---------------

function Verified({ tint }: { tint: Tint }) {
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

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[color:var(--foreground)]">
      <span className="text-[color:var(--amber)]">★</span>
      {value.toFixed(1)}
    </span>
  );
}

function TimelineStrip() {
  const clips = [
    { w: "18%", tint: "cyan",    label: "OVL_leak_014" },
    { w: "9%",  tint: "magenta", label: "TRN_rgb_02" },
    { w: "14%", tint: "amber",   label: "SFX_whoosh_hi" },
    { w: "22%", tint: "cyan",    label: "LUT_sodium_03" },
    { w: "11%", tint: "magenta", label: "OVL_grain" },
    { w: "16%", tint: "cyan",    label: "TRN_datamosh" },
    { w: "10%", tint: "amber",   label: "SFX_impact_lo" },
  ];
  const row = (
    <div className="flex shrink-0 gap-[2px] pr-[2px]">
      {clips.map((c, i) => (
        <div
          key={i}
          style={{ width: c.w }}
          className="relative h-10 border border-[color:var(--hairline)] bg-[color:var(--surface)] overflow-hidden"
        >
          <div
            className="waveform absolute inset-x-2 bottom-1 h-4 opacity-70"
            style={{ ["--wf-color" as string]: `var(--${c.tint})` }}
          />
          <span className="absolute left-2 top-1 font-mono text-[10px] tracking-wide text-[color:var(--mute)]">
            {c.label}
          </span>
          <span
            className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
            style={{ background: `var(--${c.tint})` }}
          />
        </div>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-[color:var(--hairline)] bg-[color:var(--ink)]">
      <div className="flex h-5 items-end justify-between px-4 border-b border-[color:var(--hairline)]">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="font-mono text-[9px] text-[color:var(--mute)]">
              {String(i).padStart(2, "0")}:00
            </span>
            <span className="mt-0.5 h-1 w-px bg-[color:var(--mute)] opacity-60" />
          </div>
        ))}
      </div>
      <div className="flex tl-track">
        {row}
        {row}
      </div>
    </div>
  );
}

// --------------- Search with autocomplete ---------------

function SearchBar({ big = false }: { big?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(
    () => (q ? suggestions.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : suggestions.slice(0, 6)),
    [q],
  );
  return (
    <div className={"relative " + (big ? "w-full" : "w-full max-w-md")}>
      <label className="sr-only" htmlFor="search">Search assets</label>
      <div
        className={
          "flex items-center gap-3 border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 backdrop-blur px-4 " +
          (big ? "h-14" : "h-10")
        }
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-[color:var(--mute)]" aria-hidden>
          <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
        <input
          id="search"
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
              <li className="px-4 py-3 text-sm text-[color:var(--mute)]">
                Nothing here yet. Try "grain", "whoosh", or "portra".
              </li>
            )}
            {results.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); setQ(r); }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-[color:var(--surface-2)]"
                >
                  <span>{r}</span>
                  <span className="font-mono text-[10px] text-[color:var(--mute)]">↵</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// --------------- Asset card ---------------

function AssetCard({ a }: { a: Asset }) {
  return (
    <article className="clip-card group border border-[color:var(--hairline)] bg-[color:var(--surface)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={a.img}
          alt={a.title}
          loading="lazy"
          width={1024}
          height={640}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 scanlines" />
        <div className="absolute left-3 top-3 flex items-center gap-2 bg-[color:var(--ink)]/70 px-2 py-1 font-mono text-[10px] tracking-wider text-[color:var(--foreground)] backdrop-blur">
          <span className="h-1.5 w-1.5" style={{ background: `var(--${a.tint})` }} />
          {a.tc}
        </div>
        <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--foreground)]/80">
          {a.kind}
        </div>
        <button
          type="button"
          className="absolute inset-x-3 bottom-3 flex items-center justify-between border border-[color:var(--hairline)] bg-[color:var(--ink)]/60 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--foreground)] opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] live-dot" />
            Preview
          </span>
          <span>{a.size}</span>
        </button>
        <div
          className="waveform absolute inset-x-0 bottom-0 h-6 opacity-60"
          style={{ ["--wf-color" as string]: `var(--${a.tint})` }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
            {a.title}
          </h3>
          <span
            className={
              "font-mono text-sm shrink-0 " +
              (a.price === "Free" ? "text-[color:var(--cyan)]" : "text-[color:var(--foreground)]")
            }
          >
            {a.price}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-[color:var(--mute)]">
          <span
            className="h-4 w-4 rounded-full"
            style={{ background: `color-mix(in oklab, var(--${a.tint}) 40%, var(--surface-2))` }}
          />
          <span>{a.creator}</span>
          <span className="text-[color:var(--mute)]/60">·</span>
          <Stars value={a.rating} />
          <span className="text-[color:var(--mute)]/60">·</span>
          <span>{a.downloads} dl</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
          {a.software.map((s) => (
            <span key={s} className="border border-[color:var(--hairline)] px-1.5 py-0.5">{s}</span>
          ))}
          <span className="ml-auto text-[color:var(--mute)]/80">upd {a.updated}</span>
        </div>
      </div>
    </article>
  );
}

// --------------- Sections ---------------

function Ticker() {
  const items = [
    "287 new assets this week",
    "Payouts open in 42 currencies",
    "Free SFX pack — updated today",
    "Regional pricing rolling out to 14 markets",
    "Krystl · 12.4k downloads on Light Leaks Vol.02",
    "Creator payouts processed every Friday",
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

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[color:color-mix(in_oklab,var(--background)_82%,transparent)] border-b border-[color:var(--hairline)]">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
        <a href="#" className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[color:var(--amber)] shadow-[0_0_12px_var(--amber)] live-dot" />
          <span className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--mute)]">
            REC · KRYSTLASSETS
          </span>
        </a>
        <nav className="ml-4 hidden gap-6 lg:flex">
          {[
            ["Marketplace", "#marketplace"],
            ["Creators", "#creators"],
            ["Categories", "#categories"],
            ["Sell", "#sell"],
            ["Docs", "#docs"],
          ].map(([l, h]) => (
            <a key={l} href={h} className="hair-link text-sm">{l}</a>
          ))}
        </nav>
        <div className="ml-auto hidden md:block flex-1 max-w-md">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <a href="#login" className="hair-link hidden sm:inline-block text-sm text-[color:var(--mute)] hover:text-foreground">
            Sign in
          </a>
          <a
            href="#sell"
            className="group inline-flex items-center gap-2 border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] transition-colors hover:bg-transparent hover:text-[color:var(--amber)]"
          >
            <span className="h-1.5 w-1.5 bg-[color:var(--ink)] group-hover:bg-[color:var(--amber)]" />
            Become a creator
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 spotlight" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 40% at 15% 10%, color-mix(in oklab, var(--cyan) 22%, transparent), transparent 60%), radial-gradient(50% 40% at 90% 30%, color-mix(in oklab, var(--magenta) 22%, transparent), transparent 60%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] scanlines" />

      <div className="relative mx-auto max-w-[1400px] px-6 pt-14 pb-10 md:pt-20 md:pb-16">
        <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
          <span className="h-px w-10 bg-[color:var(--mute)]" />
          <span>Marketplace · v02 · live</span>
          <span className="ml-auto hidden md:block">
            <span className="text-[color:var(--cyan)]">R</span>
            <span className="text-[color:var(--foreground)]">G</span>
            <span className="text-[color:var(--magenta)]">B</span>
            <span className="ml-2 text-[color:var(--mute)]">/ 24.000 fps</span>
          </span>
        </div>

        <h1 className="rgb-split text-[clamp(2.75rem,11vw,10rem)]">
          <span className="rgb-split-layer split-cyan" aria-hidden>krystlassets</span>
          <span className="rgb-split-layer split-magenta" aria-hidden>krystlassets</span>
          <span className="relative">krystlassets</span>
        </h1>

        <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="max-w-xl font-display text-2xl md:text-3xl leading-[1.1] tracking-tight">
              Built for editors. <span className="text-[color:var(--cyan)]">Built for creators.</span>
            </p>
            <p className="mt-4 max-w-xl text-base leading-snug text-[color:var(--foreground)]/80">
              A marketplace where cutters buy the packs they actually reach for, and creators
              get paid on Friday. Overlays, LUTs, SFX, presets, 3D — all built in a real timeline.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#marketplace"
                className="group inline-flex items-center gap-3 bg-[color:var(--foreground)] px-5 py-3 text-sm font-medium text-[color:var(--ink)] transition-all hover:bg-[color:var(--amber)]"
              >
                Explore marketplace
                <span className="font-mono text-[11px] text-[color:var(--ink)]/60 transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#sell"
                className="group inline-flex items-center gap-3 border border-[color:var(--hairline)] px-5 py-3 text-sm text-[color:var(--foreground)] transition-colors hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]"
              >
                Become a creator
                <span className="font-mono text-[11px] text-[color:var(--mute)] transition-transform group-hover:translate-x-1">↗</span>
              </a>
            </div>

            <div className="mt-8 max-w-xl">
              <SearchBar big />
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                {["grain", "portra", "whoosh", "MOGRT", "resolve LUT", "HDRI"].map((t) => (
                  <a key={t} href="#marketplace" className="border border-[color:var(--hairline)] px-2 py-1 hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">
                    {t}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 md:justify-self-end w-full">
            <div className="grid grid-cols-2 gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)]">
              {stats.map((s) => (
                <div key={s.v} className="bg-[color:var(--surface)]/70 p-5">
                  <div className="font-display text-3xl md:text-4xl tracking-tight">{s.k}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
                    {s.v}
                  </div>
                </div>
              ))}
              <div className="bg-[color:var(--surface)]/70 p-5 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[color:var(--amber)] live-dot" />
                <div>
                  <div className="font-mono text-[11px] tracking-widest text-[color:var(--foreground)]">LIVE FEED</div>
                  <div className="font-mono text-[10px] text-[color:var(--mute)]">4 uploads / min</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TimelineStrip />
    </section>
  );
}

function FilterBar() {
  const filters = [
    { label: "Software", options: ["All", "Premiere", "AE", "Resolve", "Blender", "Photoshop"] },
    { label: "Price",    options: ["Any", "Free", "Under $20", "$20–$50", "$50+"] },
    { label: "Rating",   options: ["Any", "4.5+", "4.8+", "5.0"] },
    { label: "Resolution", options: ["Any", "HD", "4K", "6K+"] },
    { label: "Style",    options: ["Any", "Cinematic", "Retro", "Glitch", "Clean"] },
    { label: "Type",     options: ["All", "Free", "Paid"] },
    { label: "Sort",     options: ["Recently added", "Trending", "Top rated", "Most downloaded"] },
  ];
  return (
    <div className="border-y border-[color:var(--hairline)] bg-[color:var(--surface)]/40">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 overflow-x-auto px-6 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)] shrink-0">
          // filters
        </span>
        {filters.map((f) => (
          <label key={f.label} className="group relative shrink-0">
            <span className="sr-only">{f.label}</span>
            <select
              className="appearance-none bg-transparent border border-[color:var(--hairline)] pl-3 pr-8 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--foreground)] hover:border-[color:var(--cyan)] focus:border-[color:var(--cyan)] focus:outline-none"
              defaultValue={f.options[0]}
            >
              {f.options.map((o) => (
                <option key={o} value={o} className="bg-[color:var(--surface)] text-[color:var(--foreground)]">
                  {f.label}: {o}
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

function Trending() {
  return (
    <section id="marketplace" className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
            // trending · bin 01 · this week
          </div>
          <h2 className="max-w-2xl font-display text-4xl md:text-5xl font-semibold leading-[0.95] tracking-tight">
            What editors are pulling into their timeline{" "}
            <em className="not-italic text-[color:var(--cyan)]">right now</em>.
          </h2>
        </div>
        <a href="#marketplace" className="hair-link hidden md:inline-block font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
          View all 14,382 →
        </a>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((a) => <AssetCard key={a.id} a={a} />)}
      </div>
    </section>
  );
}

function Creators() {
  return (
    <section id="creators" className="border-y border-[color:var(--hairline)] bg-[color:var(--surface)]/30">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
              // featured creators
            </div>
            <h2 className="max-w-2xl font-display text-3xl md:text-5xl font-semibold leading-[0.95] tracking-tight">
              The people whose folders you'd <em className="not-italic text-[color:var(--magenta)]">steal</em>.
            </h2>
          </div>
          <a href="#creators" className="hair-link hidden md:inline-block font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
            Directory →
          </a>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {creators.map((c) => (
            <li key={c.handle} className="group border border-[color:var(--hairline)] bg-[color:var(--surface)] p-5 transition-colors hover:border-[color:var(--cyan)]">
              <div className="flex items-start gap-3">
                <span
                  className="h-12 w-12 rounded-full border"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--${c.tint}) 55%, transparent), var(--surface-2))`,
                    borderColor: `color-mix(in oklab, var(--${c.tint}) 60%, transparent)`,
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg">{c.name}</span>
                    {c.verified && <Verified tint={c.tint} />}
                  </div>
                  <div className="font-mono text-[11px] text-[color:var(--mute)]">{c.handle}</div>
                </div>
                <button className="border border-[color:var(--hairline)] px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--amber)] hover:text-[color:var(--amber)]">
                  Follow
                </button>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div>
                  <div className="text-[color:var(--foreground)]">{c.followers}</div>
                  <div className="text-[color:var(--mute)] text-[10px] uppercase tracking-widest">followers</div>
                </div>
                <div>
                  <div className="text-[color:var(--foreground)]">{c.sales}</div>
                  <div className="text-[color:var(--mute)] text-[10px] uppercase tracking-widest">sales</div>
                </div>
                <div>
                  <div className="text-[color:var(--foreground)]"><Stars value={c.rating} /></div>
                  <div className="text-[color:var(--mute)] text-[10px] uppercase tracking-widest">rating</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
      <div className="mb-8">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
          // browse by category
        </div>
        <h2 className="font-display text-3xl md:text-5xl font-semibold leading-[0.95] tracking-tight">
          Every bin, one <em className="not-italic text-[color:var(--amber)]">click</em> away.
        </h2>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <li key={c.label}>
            <a
              href="#marketplace"
              className={
                "group relative flex items-center justify-between gap-3 border-[color:var(--hairline)] px-5 py-6 transition-colors hover:bg-[color:var(--surface)] " +
                "border-t border-l " +
                ((i + 1) % 2 === 0 ? "border-r sm:border-r-0 " : "") +
                ((i + 1) % 3 === 0 ? "sm:border-r " : "sm:border-r-0 ") +
                ((i + 1) % 4 === 0 ? "lg:border-r " : "lg:border-r-0 ") +
                (i >= categories.length - 2 ? "border-b " : "") +
                (i >= categories.length - 3 ? "sm:border-b " : "") +
                (i >= categories.length - 4 ? "lg:border-b " : "")
              }
            >
              <span className="font-display text-xl tracking-tight">{c.label}</span>
              <span className="font-mono text-xs text-[color:var(--mute)] group-hover:text-[color:var(--cyan)]">{c.n}</span>
              <span aria-hidden className="absolute inset-x-5 bottom-4 h-px scale-x-0 origin-left bg-[color:var(--cyan)] transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CreatorDashboard() {
  return (
    <section id="sell" className="relative overflow-hidden border-y border-[color:var(--hairline)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 90% 20%, color-mix(in oklab, var(--magenta) 20%, transparent), transparent 60%), radial-gradient(60% 60% at 10% 90%, color-mix(in oklab, var(--cyan) 16%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-6 py-20 md:py-28 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
            // creator studio
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[0.95] tracking-tight">
            Ship your pack. Get paid <em className="not-italic text-[color:var(--amber)]">Friday</em>.
          </h2>
          <p className="mt-6 max-w-md text-[color:var(--foreground)]/80">
            Upload once. We handle previews, licensing, invoicing, tax forms, refunds, and version updates.
            You keep <span className="text-[color:var(--foreground)]">85%</span> on every sale.
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--foreground)]">
            {[
              "Upload dashboard",
              "Revenue dashboard",
              "Analytics",
              "Withdraw earnings",
              "Follower graph",
              "Reviews",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 border border-[color:var(--hairline)] px-3 py-2">
                <span className="h-1.5 w-1.5 bg-[color:var(--cyan)]" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 bg-[color:var(--amber)] px-5 py-3 text-sm font-medium text-[color:var(--ink)] hover:-translate-y-0.5 transition-transform">
              Start selling
              <span className="font-mono text-[11px] text-[color:var(--ink)]/70">→</span>
            </a>
            <a href="#docs" className="hair-link text-sm text-[color:var(--mute)] hover:text-foreground self-center">
              Read the creator handbook
            </a>
          </div>
        </div>

        <div className="md:col-span-7">
          {/* mock dashboard */}
          <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 backdrop-blur">
            <div className="flex items-center justify-between border-b border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] tracking-widest text-[color:var(--mute)]">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] live-dot" />
                DASHBOARD · @krystl · Q3
              </span>
              <span>MRR · $12,480</span>
            </div>
            <div className="grid grid-cols-3 border-b border-[color:var(--hairline)]">
              {[
                { k: "$182,410", v: "Lifetime revenue", tint: "amber" },
                { k: "12,442",   v: "Downloads (30d)", tint: "cyan" },
                { k: "4.9",      v: "Avg. rating", tint: "magenta" },
              ].map((s) => (
                <div key={s.v} className="border-r last:border-r-0 border-[color:var(--hairline)] p-5">
                  <div className="font-display text-3xl tracking-tight" style={{ color: `var(--${s.tint})` }}>
                    {s.k}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                <span>Revenue · last 30 days</span>
                <span>+18.4%</span>
              </div>
              {/* Chart mock */}
              <div className="relative h-32 w-full">
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="h-full w-full">
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 L20,70 L40,72 L60,55 L80,60 L100,42 L120,50 L140,35 L160,40 L180,25 L200,30 L220,18 L240,26 L260,14 L280,20 L300,8 L300,100 L0,100 Z" fill="url(#g1)" />
                  <path d="M0,80 L20,70 L40,72 L60,55 L80,60 L100,42 L120,50 L140,35 L160,40 L180,25 L200,30 L220,18 L240,26 L260,14 L280,20 L300,8" fill="none" stroke="var(--cyan)" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-widest">
                {["Uploads", "Payouts", "Reviews", "Followers"].map((t, i) => (
                  <button key={t} className={"border border-[color:var(--hairline)] px-2 py-2 text-left hover:border-[color:var(--cyan)] " + (i === 0 ? "text-[color:var(--foreground)]" : "text-[color:var(--mute)]") }>
                    <div>{t}</div>
                    <div className="mt-1 text-[color:var(--foreground)] text-xs">{["24", "$14.2k", "312", "+186"][i]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyKrystl() {
  const items = [
    { title: "Global payouts",       body: "Get paid in 42 currencies — bank, PayPal, or Wise. Weekly, automatic.", tint: "amber" as Tint },
    { title: "Regional pricing",     body: "Sell fairly worldwide. We adjust prices per market so nobody gets priced out.", tint: "cyan" as Tint },
    { title: "Commercial licensing", body: "Client work, brand deals, ads. Clear license on every download, no lawyer needed.", tint: "magenta" as Tint },
    { title: "Fast downloads",       body: "Edge-cached CDN. 4K packs stream to your bin instead of buffering.", tint: "cyan" as Tint },
    { title: "Secure payments",      body: "PCI-DSS checkout. Fraud protection and refunds handled for you.", tint: "amber" as Tint },
    { title: "Version updates",      body: "Push a v2 and every buyer gets the update — automatically, for free.", tint: "magenta" as Tint },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
      <div className="mb-10 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
            // why creators choose krystl
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-semibold leading-[0.95] tracking-tight">
            Infrastructure that gets out of your <em className="not-italic text-[color:var(--cyan)]">way</em>.
          </h2>
        </div>
        <p className="md:col-span-5 text-[color:var(--foreground)]/75">
          Payments, licensing, hosting, taxes, delivery, updates. We run the ops so you can go back to making the thing.
        </p>
      </div>

      <ul className="grid gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <li key={it.title} className="group bg-[color:var(--background)] p-6 transition-colors hover:bg-[color:var(--surface)]">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full" style={{ background: `var(--${it.tint})`, boxShadow: `0 0 14px var(--${it.tint})` }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
                feature
              </span>
            </div>
            <h3 className="mt-4 font-display text-2xl tracking-tight">{it.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--foreground)]/75">{it.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CTA() {
  return (
    <section id="join" className="relative overflow-hidden border-t border-[color:var(--hairline)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, color-mix(in oklab, var(--magenta) 22%, transparent), transparent 60%), radial-gradient(60% 60% at 10% 0%, color-mix(in oklab, var(--cyan) 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-6 py-24 md:py-32 text-center">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
          // built for editors · built for creators
        </div>
        <h2 className="mx-auto max-w-4xl font-display text-4xl md:text-7xl font-semibold leading-[0.95] tracking-tight">
          Pull the pack. Or <em className="not-italic text-[color:var(--amber)]">ship</em> one.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#marketplace" className="inline-flex items-center gap-3 bg-[color:var(--foreground)] px-6 py-4 text-sm font-medium text-[color:var(--ink)] transition-transform hover:-translate-y-0.5">
            Explore marketplace
            <span className="font-mono text-[11px] text-[color:var(--ink)]/60">14,382 assets</span>
          </a>
          <a href="#sell" className="inline-flex items-center gap-3 border border-[color:var(--amber)] px-6 py-4 text-sm font-medium text-[color:var(--amber)] hover:bg-[color:var(--amber)] hover:text-[color:var(--ink)] transition-colors">
            Become a creator
            <span className="font-mono text-[11px] opacity-70">85% payout</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Marketplace", links: ["Trending", "New", "Free", "Categories"] },
    { title: "Creators",    links: ["Sell your assets", "Creator Program", "Payouts", "Handbook"] },
    { title: "Resources",   links: ["Documentation", "Licensing", "API", "Status"] },
    { title: "Company",     links: ["Support", "Blog", "Careers", "Contact"] },
  ];
  return (
    <footer id="docs" className="border-t border-[color:var(--hairline)] bg-[color:var(--ink)]/60">
      <div className="mx-auto max-w-[1400px] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[color:var(--amber)] shadow-[0_0_12px_var(--amber)] live-dot" />
              <span className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--mute)]">
                REC · KRYSTLASSETS · v02
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-[color:var(--foreground)]/70">
              The marketplace for editors and creators. Overlays, LUTs, SFX, motion, 3D — built inside a real timeline.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest">
              {["Discord", "YouTube", "Instagram"].map((s) => (
                <a key={s} href="#" className="border border-[color:var(--hairline)] px-3 py-2 hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">
                  {s}
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
                {c.title}
              </div>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="hair-link text-[color:var(--foreground)]/80 hover:text-foreground">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[color:var(--hairline)] pt-6 md:flex-row md:items-center md:justify-between">
          <div className="font-mono text-[11px] tracking-wider text-[color:var(--mute)]">
            KRYSTLASSETS © 2026 · MADE IN THE TIMELINE · LOS ANGELES / EVERYWHERE
          </div>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
            <a href="#" className="hair-link">Terms</a>
            <a href="#" className="hair-link">Privacy</a>
            <a href="#" className="hair-link">License</a>
            <a href="#" className="hair-link">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-[color:var(--magenta)]">
      <Ticker />
      <Header />
      <Hero />
      <FilterBar />
      <Trending />
      <Creators />
      <Categories />
      <CreatorDashboard />
      <WhyKrystl />
      <CTA />
      <Footer />
    </main>
  );
}
