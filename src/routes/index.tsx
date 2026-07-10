import { createFileRoute } from "@tanstack/react-router";
import lightleaks from "@/assets/pack-lightleaks.jpg";
import glitch from "@/assets/pack-glitch.jpg";
import sfx from "@/assets/pack-sfx.jpg";
import luts from "@/assets/pack-luts.jpg";

export const Route = createFileRoute("/")({
  component: Landing,
});

const packs = [
  {
    tc: "00:04:12:03",
    kind: "OVERLAYS",
    title: "Anamorphic Light Leaks",
    count: "42 clips · 4K ProRes",
    price: "$28",
    img: lightleaks,
    tint: "cyan" as const,
  },
  {
    tc: "00:02:47:18",
    kind: "TRANSITIONS",
    title: "RGB Split & Datamosh",
    count: "36 clips · alpha + MOGRT",
    price: "$34",
    img: glitch,
    tint: "magenta" as const,
  },
  {
    tc: "00:11:03:00",
    kind: "SFX",
    title: "Whooshes, Risers, Impacts",
    count: "180 sounds · 24bit WAV",
    price: "$22",
    img: sfx,
    tint: "cyan" as const,
  },
  {
    tc: "00:00:24:00",
    kind: "LUTS",
    title: "Filmic Teal / Sodium",
    count: "24 LUTs · .cube",
    price: "$18",
    img: luts,
    tint: "magenta" as const,
  },
];

const categories = [
  { label: "Overlays", n: "042" },
  { label: "Transitions", n: "036" },
  { label: "SFX", n: "180" },
  { label: "LUTs", n: "024" },
  { label: "Motion Graphics", n: "058" },
  { label: "Titles", n: "019" },
];

// A single fixed-height timeline strip; content repeats twice for seamless loop.
function TimelineStrip() {
  const clips = [
    { w: "18%", tint: "cyan", label: "OVL_leak_014" },
    { w: "9%",  tint: "magenta", label: "TRN_rgb_02" },
    { w: "14%", tint: "amber", label: "SFX_whoosh_hi" },
    { w: "22%", tint: "cyan", label: "LUT_sodium_03" },
    { w: "11%", tint: "magenta", label: "OVL_grain" },
    { w: "16%", tint: "cyan", label: "TRN_datamosh" },
    { w: "10%", tint: "amber", label: "SFX_impact_lo" },
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
      {/* ruler */}
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
      {/* tracks */}
      <div className="flex tl-track">
        {row}
        {row}
      </div>
    </div>
  );
}

function Landing() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-[color:var(--magenta)]">
      {/* Top rail */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-[color:color-mix(in_oklab,var(--background)_82%,transparent)] border-b border-[color:var(--hairline)]">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[color:var(--amber)] shadow-[0_0_12px_var(--amber)]" />
            <span className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--mute)]">
              REC · KRYSTLASSETS · v01
            </span>
          </div>
          <nav className="hidden gap-8 md:flex">
            {["Library", "Packs", "Free", "About"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hair-link text-sm">
                {l}
              </a>
            ))}
          </nav>
          <a
            href="#packs"
            className="group inline-flex items-center gap-2 border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] transition-colors hover:bg-transparent hover:text-[color:var(--amber)]"
          >
            <span className="h-1.5 w-1.5 bg-[color:var(--ink)] group-hover:bg-[color:var(--amber)]" />
            Get pack
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* ambient dichroic glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 40% at 15% 10%, color-mix(in oklab, var(--cyan) 22%, transparent), transparent 60%), radial-gradient(50% 40% at 90% 30%, color-mix(in oklab, var(--magenta) 22%, transparent), transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 pt-16 pb-10 md:pt-24 md:pb-16">
          {/* eyebrow line */}
          <div className="mb-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
            <span className="h-px w-10 bg-[color:var(--mute)]" />
            <span>Pack 001 / released now</span>
            <span className="ml-auto hidden md:block">
              <span className="text-[color:var(--cyan)]">R</span>
              <span className="text-[color:var(--foreground)]">G</span>
              <span className="text-[color:var(--magenta)]">B</span>
              <span className="ml-2 text-[color:var(--mute)]">/ 24.000 fps</span>
            </span>
          </div>

          {/* Chromatic wordmark */}
          <h1 className="rgb-split text-[clamp(3.25rem,12vw,11rem)]">
            <span className="rgb-split-layer split-cyan" aria-hidden>
              krystlassets
            </span>
            <span className="rgb-split-layer split-magenta" aria-hidden>
              krystlassets
            </span>
            <span className="relative">krystlassets</span>
          </h1>

          <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
            <p className="md:col-span-6 max-w-xl text-lg leading-snug text-[color:var(--foreground)]/85">
              Overlays, transitions, SFX and LUTs built inside a real timeline —
              not a mood board. Drop them in, cut on the beat, ship the edit.
            </p>

            <div className="md:col-span-6 md:justify-self-end">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#packs"
                  className="group inline-flex items-center gap-3 bg-[color:var(--foreground)] px-5 py-3 text-sm font-medium text-[color:var(--ink)] transition-all hover:bg-[color:var(--amber)]"
                >
                  Browse the library
                  <span className="font-mono text-[11px] text-[color:var(--ink)]/60 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a href="#free" className="hair-link text-sm text-[color:var(--mute)] hover:text-foreground">
                  Grab 12 free clips
                </a>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-6 font-mono text-[11px] tracking-wider text-[color:var(--mute)] md:justify-items-end md:text-right">
                <div>
                  <div className="text-[color:var(--foreground)] text-lg">359</div>
                  <div>ASSETS</div>
                </div>
                <div>
                  <div className="text-[color:var(--foreground)] text-lg">4K</div>
                  <div>PRORES · WAV · .CUBE</div>
                </div>
                <div>
                  <div className="text-[color:var(--foreground)] text-lg">∞</div>
                  <div>COMMERCIAL USE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero timeline strip */}
        <TimelineStrip />
      </section>

      {/* Library / packs */}
      <section id="packs" className="mx-auto max-w-[1400px] px-6 py-20 md:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
              // Library · bin 01
            </div>
            <h2 className="max-w-2xl font-display text-4xl md:text-6xl font-semibold leading-[0.95] tracking-tight">
              The stuff you keep <em className="not-italic text-[color:var(--cyan)]">reaching for</em> at 2am.
            </h2>
          </div>
          <a href="#library" className="hair-link hidden md:inline-block font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
            View all 359
          </a>
        </div>

        <ul className="grid gap-5 md:grid-cols-2">
          {packs.map((p) => (
            <li key={p.title} className="clip-card group border border-[color:var(--hairline)] bg-[color:var(--surface)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                {/* timecode chip */}
                <div className="absolute left-3 top-3 flex items-center gap-2 bg-[color:var(--ink)]/70 px-2 py-1 font-mono text-[10px] tracking-wider text-[color:var(--foreground)] backdrop-blur">
                  <span
                    className="h-1.5 w-1.5"
                    style={{ background: `var(--${p.tint})` }}
                  />
                  {p.tc}
                </div>
                <div className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--foreground)]/80">
                  {p.kind}
                </div>
                {/* waveform footer */}
                <div
                  className="waveform absolute inset-x-0 bottom-0 h-8"
                  style={{ ["--wf-color" as string]: `var(--${p.tint})` }}
                />
              </div>
              <div className="flex items-end justify-between gap-4 p-5">
                <div>
                  <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] tracking-wider text-[color:var(--mute)]">
                    {p.count}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-[color:var(--foreground)]">{p.price}</span>
                  <button className="border border-[color:var(--hairline)] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--foreground)] transition-colors hover:border-[color:var(--amber)] hover:text-[color:var(--amber)]">
                    Add to bin
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Categories bin */}
      <section id="library" className="border-y border-[color:var(--hairline)] bg-[color:var(--surface)]/40">
        <div className="mx-auto max-w-[1400px] px-6 py-16">
          <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
            // Project bins
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((c, i) => (
              <li
                key={c.label}
                className={
                  "group flex items-baseline justify-between gap-3 border-[color:var(--hairline)] px-5 py-6 transition-colors hover:bg-[color:var(--surface)] " +
                  (i === 0 ? "border" : "border-t border-b md:border-t md:border-b md:border-l") +
                  (i === categories.length - 1 ? " md:border-r" : "")
                }
              >
                <span className="font-display text-2xl tracking-tight">{c.label}</span>
                <span className="font-mono text-xs text-[color:var(--mute)] group-hover:text-[color:var(--cyan)]">
                  {c.n}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Manifesto / about */}
      <section id="about" className="mx-auto max-w-[1400px] px-6 py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
              // note from krystl
            </div>
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-[color:var(--magenta)]/30 border border-[color:var(--magenta)]" />
              <div>
                <div className="text-sm">Krystl</div>
                <div className="font-mono text-[11px] text-[color:var(--mute)]">
                  editor · Los Angeles · CA
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-3xl md:text-5xl font-medium leading-[1.05] tracking-tight">
              I built these packs on{" "}
              <span className="text-[color:var(--magenta)]">deadline</span>, in the same timeline you're
              cutting in. Nothing here is a stock library. It's the folder I actually{" "}
              <span className="text-[color:var(--cyan)]">duplicate</span> when a new job starts.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3 text-sm">
              <div>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">
                  Cut-ready
                </div>
                <p className="text-[color:var(--foreground)]/80">
                  Trimmed, labeled, and named to sort in your bin. No 30-second builds to a two-second whoosh.
                </p>
              </div>
              <div>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--magenta)]">
                  Native formats
                </div>
                <p className="text-[color:var(--foreground)]/80">
                  ProRes 4444, alpha channels, 24-bit WAV, .cube LUTs. Premiere, Resolve, FCP, After Effects.
                </p>
              </div>
              <div>
                <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--amber)]">
                  Yours to keep
                </div>
                <p className="text-[color:var(--foreground)]/80">
                  Commercial license included on every pack. Client work, brand deals, ads — go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="free" className="relative overflow-hidden border-t border-[color:var(--hairline)]">
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
            // free · 12 clips · no email required
          </div>
          <h2 className="mx-auto max-w-4xl font-display text-4xl md:text-7xl font-semibold leading-[0.95] tracking-tight">
            Try the pack in your next{" "}
            <span className="italic text-[color:var(--amber)]">cut</span>.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-[color:var(--amber)] px-6 py-4 text-sm font-medium text-[color:var(--ink)] transition-transform hover:-translate-y-0.5"
            >
              Download starter pack
              <span className="font-mono text-[11px] text-[color:var(--ink)]/70">.zip · 240MB</span>
            </a>
            <a href="#packs" className="hair-link text-sm text-[color:var(--mute)] hover:text-foreground">
              or see the full library
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[color:var(--hairline)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-wider text-[color:var(--mute)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)]" />
            KRYSTLASSETS © 2026 · MADE IN THE TIMELINE
          </div>
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
            <a href="#" className="hair-link">Instagram</a>
            <a href="#" className="hair-link">YouTube</a>
            <a href="#" className="hair-link">Contact</a>
            <a href="#" className="hair-link">License</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
