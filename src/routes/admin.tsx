import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader, Chip } from "@/components/site";
import { assets, creators } from "@/lib/mock";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <Shell>
      <PageHeader eyebrow="// admin · marketplace ops" title={<>Keep the room quiet, and the timeline clean.</>} />
      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="grid grid-cols-2 gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] md:grid-cols-4 lg:grid-cols-6">
          {[
            { k: "14,382", v: "Assets" },
            { k: "3,914",  v: "Creators" },
            { k: "182",    v: "Pending review", tint: "amber" },
            { k: "14",     v: "Reported", tint: "magenta" },
            { k: "$482k",  v: "GMV (30d)" },
            { k: "15%",    v: "Commission" },
          ].map((s) => (
            <div key={s.v} className="bg-[color:var(--surface)]/70 p-5">
              <div className="font-display text-2xl tracking-tight" style={{ color: s.tint ? `var(--${s.tint})` : undefined }}>{s.k}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">{s.v}</div>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Asset approvals</h2>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">14 pending</span>
          </div>
          <div className="border border-[color:var(--hairline)]">
            {assets.slice(0, 5).map((a) => (
              <div key={a.id} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center border-b border-[color:var(--hairline)] px-5 py-4 last:border-b-0 text-sm">
                <div className="col-span-2 md:col-span-3 flex items-center gap-3">
                  <img src={a.img} alt="" className="h-10 w-16 object-cover" />
                  <div><div>{a.title}</div><div className="font-mono text-[10px] text-[color:var(--mute)]">by {a.creator} · {a.kind}</div></div>
                </div>
                <span><Chip tint="amber">Pending</Chip></span>
                <span className="font-mono text-[10px] text-[color:var(--mute)]">submitted 2h ago</span>
                <span className="flex gap-2 justify-end">
                  <button className="border border-[color:var(--magenta)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--magenta)]">Reject</button>
                  <button className="border border-[color:var(--cyan)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--cyan)]">Approve</button>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-2xl">Creator verifications</h2>
            <ul className="border border-[color:var(--hairline)] divide-y divide-[color:var(--hairline)]">
              {creators.filter(c => !c.verified).map((c) => (
                <li key={c.handle} className="flex items-center gap-3 p-4">
                  <div className="flex-1"><div className="font-display">{c.name}</div><div className="font-mono text-[10px] text-[color:var(--mute)]">@{c.handle} · {c.totalSales} sales</div></div>
                  <button className="border border-[color:var(--hairline)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--cyan)]">Review</button>
                  <button className="border border-[color:var(--cyan)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--cyan)]">Verify</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-display text-2xl">Reports</h2>
            <ul className="border border-[color:var(--hairline)] divide-y divide-[color:var(--hairline)]">
              {[
                { t: "Asset · RGB Split Kit", r: "possible license violation", n: 3 },
                { t: "User · @paperlane", r: "spam in reviews", n: 1 },
                { t: "Asset · HDRI Studio", r: "duplicate", n: 2 },
              ].map((x, i) => (
                <li key={i} className="p-4">
                  <div className="flex justify-between text-sm"><span>{x.t}</span><Chip tint="magenta">{x.n} reports</Chip></div>
                  <div className="mt-1 font-mono text-[10px] text-[color:var(--mute)]">{x.r}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Shell>
  );
}
