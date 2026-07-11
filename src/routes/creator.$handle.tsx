import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell, Stars, Verified, CreatorAvatar, AssetGrid, SectionLabel, Chip } from "@/components/site";
import { creatorByHandle, byCreator, sampleReviews } from "@/lib/mock";

export const Route = createFileRoute("/creator/$handle")({
  loader: ({ params }) => {
    const c = creatorByHandle(params.handle);
    if (!c) throw notFound();
    return { creator: c };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.creator.name} — Krystlassets` },
          { name: "description", content: loaderData.creator.bio },
          { property: "og:title", content: `${loaderData.creator.name} on Krystlassets` },
        ]
      : [{ title: "Creator — Krystlassets" }, { name: "robots", content: "noindex" }],
  }),
  component: CreatorPage,
  notFoundComponent: () => (
    <Shell><div className="mx-auto max-w-2xl px-6 py-32 text-center"><h1 className="font-display text-5xl">Creator not found.</h1><Link to="/creators" className="mt-6 inline-block hair-link">Back to directory</Link></div></Shell>
  ),
});

function CreatorPage() {
  const { creator: c } = Route.useLoaderData();
  const items = byCreator(c.handle);
  return (
    <Shell>
      <section className="relative overflow-hidden border-b border-[color:var(--hairline)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(50% 60% at 20% 20%, color-mix(in oklab, var(--${c.tint}) 24%, transparent), transparent 60%), radial-gradient(60% 60% at 90% 30%, color-mix(in oklab, var(--cyan) 18%, transparent), transparent 60%)` }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] scanlines" />
        <div className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-12">
          <div className="flex flex-wrap items-end gap-8">
            <CreatorAvatar tint={c.tint} size={112} />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight">{c.name}</h1>
                {c.verified && <Verified tint={c.tint} />}
              </div>
              <div className="mt-1 font-mono text-[12px] text-[color:var(--mute)]">@{c.handle} · {c.location} · joined {c.joined}</div>
              <p className="mt-3 max-w-xl text-[color:var(--foreground)]/85">{c.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.achievements.map((a) => <Chip key={a} tint={c.tint}>{a}</Chip>)}
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] hover:bg-transparent hover:text-[color:var(--amber)]">Follow</button>
              <button className="border border-[color:var(--hairline)] px-5 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">Message</button>
              <a href={`https://${c.website}`} className="border border-[color:var(--hairline)] px-5 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--foreground)]">{c.website} ↗</a>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] md:grid-cols-6">
            {[
              { k: c.followers, v: "Followers" },
              { k: c.following, v: "Following" },
              { k: c.published.toString(), v: "Published" },
              { k: c.totalSales.toLocaleString(), v: "Total sales" },
              { k: `${c.rating.toFixed(1)} ★`, v: "Rating" },
              { k: c.responseTime, v: "Response time" },
            ].map((s) => (
              <div key={s.v} className="bg-[color:var(--surface)]/70 p-5">
                <div className="font-display text-2xl tracking-tight">{s.k}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16">
        <SectionLabel>// portfolio · {items.length} assets</SectionLabel>
        {items.length > 0 ? <AssetGrid items={items} /> : <div className="text-[color:var(--mute)]">Nothing published yet.</div>}
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24">
        <SectionLabel>// reviews</SectionLabel>
        <ul className="grid gap-4 md:grid-cols-2">
          {sampleReviews.map((r) => (
            <li key={r.id} className="border border-[color:var(--hairline)] p-5">
              <div className="flex items-center gap-3">
                <CreatorAvatar tint="cyan" size={32} />
                <div>
                  <div className="font-display">{r.author}</div>
                  <div className="font-mono text-[10px] text-[color:var(--mute)]">@{r.handle} · {r.date}</div>
                </div>
                <div className="ml-auto"><Stars value={r.rating} /></div>
              </div>
              <p className="mt-3 text-sm text-[color:var(--foreground)]/85">{r.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
