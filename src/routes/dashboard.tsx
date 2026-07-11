import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Shell, SectionLabel, CreatorAvatar, Chip } from "@/components/site";
import { assets, notifications } from "@/lib/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <Shell>
      <div className="border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/40">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3 overflow-x-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">// creator studio</span>
          {[
            ["Overview","/dashboard"],
            ["Assets","/dashboard"],
            ["Upload","/dashboard/upload"],
            ["Analytics","/dashboard"],
            ["Earnings","/dashboard"],
            ["Reviews","/dashboard"],
            ["Followers","/dashboard"],
            ["Settings","/account"],
          ].map(([l,h], i) => (
            <Link key={l} to={h as string} className={"font-mono text-[11px] uppercase tracking-widest " + (i===0?"text-[color:var(--cyan)]":"text-[color:var(--mute)] hover:text-[color:var(--foreground)]")}>{l}</Link>
          ))}
        </div>
      </div>
      <Outlet />
      <DashboardOverview />
    </Shell>
  );
}

function DashboardOverview() {
  const stats = [
    { k: "$182,410", v: "Lifetime revenue", tint: "amber" as const, d: "+18.4%" },
    { k: "$12,480",  v: "MRR",              tint: "cyan"  as const, d: "+6.1%" },
    { k: "$4,182",   v: "Pending balance",  tint: "magenta" as const, d: "withdraw ready" },
    { k: "12,442",   v: "Downloads (30d)",  tint: "cyan"  as const, d: "+22.7%" },
    { k: "48.2k",    v: "Followers",        tint: "amber" as const, d: "+312 this week" },
    { k: "4.9 ★",    v: "Rating",           tint: "magenta" as const, d: "412 reviews" },
  ];
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel>// dashboard · @krystl · Q1 2026</SectionLabel>
          <h1 className="font-display text-4xl md:text-5xl">Good morning, Krystl.</h1>
          <p className="mt-2 text-[color:var(--mute)]">You made 42 sales while you were sleeping.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/upload" className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]">+ New upload</Link>
          <button className="border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)]">Withdraw</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.v} className="bg-[color:var(--surface)]/70 p-5">
            <div className="font-display text-2xl tracking-tight" style={{ color: `var(--${s.tint})` }}>{s.k}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">{s.v}</div>
            <div className="mt-2 font-mono text-[10px] text-[color:var(--foreground)]/70">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 p-5">
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
            <span>Revenue · last 30 days</span><span className="text-[color:var(--amber)]">+18.4%</span>
          </div>
          <svg viewBox="0 0 600 180" preserveAspectRatio="none" className="h-56 w-full">
            <defs>
              <linearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,150 L40,140 L80,142 L120,110 L160,120 L200,84 L240,100 L280,70 L320,80 L360,50 L400,60 L440,36 L480,52 L520,28 L560,40 L600,16 L600,180 L0,180 Z" fill="url(#dg1)" />
            <path d="M0,150 L40,140 L80,142 L120,110 L160,120 L200,84 L240,100 L280,70 L320,80 L360,50 L400,60 L440,36 L480,52 L520,28 L560,40 L600,16" fill="none" stroke="var(--cyan)" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 p-5">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">// recent notifications</div>
          <ul className="space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <li key={n.id} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5" style={{ background: `var(--${n.tint})` }} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{n.title}</div>
                  <div className="truncate font-mono text-[11px] text-[color:var(--mute)]">{n.body}</div>
                </div>
                <span className="font-mono text-[10px] text-[color:var(--mute)]">{n.time}</span>
              </li>
            ))}
          </ul>
          <Link to="/notifications" className="mt-4 inline-block hair-link font-mono text-[11px] uppercase tracking-widest">View all →</Link>
        </div>
      </div>

      <section className="mt-10">
        <SectionLabel>// your assets</SectionLabel>
        <div className="border border-[color:var(--hairline)]">
          <div className="hidden md:grid grid-cols-8 gap-4 border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/50 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
            <span className="col-span-3">Title</span><span>Status</span><span>Price</span><span>Downloads</span><span>Rating</span><span></span>
          </div>
          {assets.slice(0, 6).map((a) => (
            <div key={a.id} className="grid grid-cols-2 md:grid-cols-8 gap-4 border-b border-[color:var(--hairline)] px-5 py-4 last:border-b-0 text-sm items-center">
              <div className="col-span-2 md:col-span-3 flex items-center gap-3">
                <img src={a.img} alt="" className="h-10 w-16 object-cover" />
                <div className="min-w-0">
                  <div className="truncate">{a.title}</div>
                  <div className="font-mono text-[10px] text-[color:var(--mute)]">v{a.version} · {a.kind}</div>
                </div>
              </div>
              <span><Chip tint="cyan">Published</Chip></span>
              <span className="font-mono">{a.price===0?"Free":`$${a.price}`}</span>
              <span className="font-mono">{a.downloads}</span>
              <span className="font-mono">{a.rating.toFixed(1)} ★</span>
              <span className="flex gap-2 justify-end">
                <button className="hair-link text-[color:var(--mute)]">Edit</button>
                <button className="hair-link text-[color:var(--mute)]">Stats</button>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 p-5">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">// recent orders</div>
          <ul className="space-y-2 text-sm">
            {[
              { asset: "Anamorphic Light Leaks Vol.02", buyer: "priya.mp4", amt: "$28.00", t: "2m ago" },
              { asset: "Grain 4K — Super 8", buyer: "d.morena", amt: "$16.00", t: "1h ago" },
              { asset: "Anamorphic Light Leaks Vol.02", buyer: "ivan_edits", amt: "$28.00", t: "3h ago" },
              { asset: "Grain 4K — Super 8", buyer: "naomi.cuts", amt: "$16.00", t: "5h ago" },
            ].map((o, i) => (
              <li key={i} className="flex items-center gap-3">
                <CreatorAvatar tint="magenta" size={24} />
                <div className="min-w-0 flex-1"><div className="truncate">{o.asset}</div><div className="font-mono text-[10px] text-[color:var(--mute)]">@{o.buyer} · {o.t}</div></div>
                <div className="font-mono text-[color:var(--amber)]">{o.amt}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)]/70 p-5">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">// followers · last 90 days</div>
          <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="h-48 w-full">
            <path d="M0,140 L60,130 L120,120 L180,100 L240,110 L300,80 L360,90 L420,60 L480,70 L540,40 L600,20" fill="none" stroke="var(--magenta)" strokeWidth="1.5" />
          </svg>
        </div>
      </section>
    </div>
  );
}
