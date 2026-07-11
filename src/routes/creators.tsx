import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader, Verified, CreatorAvatar, Stars } from "@/components/site";
import { creators } from "@/lib/mock";

export const Route = createFileRoute("/creators")({
  head: () => ({ meta: [{ title: "Creators — Krystlassets" }, { name: "description", content: "Discover top verified creators on Krystlassets." }] }),
  component: CreatorsPage,
});

function CreatorsPage() {
  const sorted = [...creators].sort((a, b) => b.totalSales - a.totalSales);
  return (
    <Shell>
      <PageHeader
        eyebrow="// creators · directory"
        title={<>The people whose folders you'd <em className="not-italic text-[color:var(--magenta)]">steal</em>.</>}
        sub="3,914 makers. Editors, colorists, sound designers, 3D artists. Follow the ones you'd hire."
      />
      <section className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-widest">
          {["Top sellers","Rising stars","Verified","Newest","All"].map((t, i) => (
            <button key={t} className={"border px-3 py-1.5 " + (i === 0 ? "border-[color:var(--cyan)] text-[color:var(--cyan)]" : "border-[color:var(--hairline)] text-[color:var(--mute)] hover:text-[color:var(--foreground)]")}>{t}</button>
          ))}
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sorted.map((c, i) => (
            <li key={c.handle} className="group border border-[color:var(--hairline)] bg-[color:var(--surface)] p-5 transition-colors hover:border-[color:var(--cyan)]">
              <div className="flex items-start gap-3">
                <CreatorAvatar tint={c.tint} size={48} />
                <div className="flex-1">
                  <Link to="/creator/$handle" params={{ handle: c.handle }} className="flex items-center gap-2">
                    <span className="font-display text-lg">{c.name}</span>
                    {c.verified && <Verified tint={c.tint} />}
                    <span className="ml-auto font-mono text-[10px] text-[color:var(--mute)]">#{i+1}</span>
                  </Link>
                  <div className="font-mono text-[11px] text-[color:var(--mute)]">@{c.handle}</div>
                </div>
              </div>
              <p className="mt-3 text-sm text-[color:var(--foreground)]/80 line-clamp-2">{c.bio}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
                <div><div>{c.followers}</div><div className="text-[10px] uppercase tracking-widest text-[color:var(--mute)]">followers</div></div>
                <div><div>{c.sales}</div><div className="text-[10px] uppercase tracking-widest text-[color:var(--mute)]">sales</div></div>
                <div><Stars value={c.rating} /><div className="text-[10px] uppercase tracking-widest text-[color:var(--mute)]">rating</div></div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to="/creator/$handle" params={{ handle: c.handle }} className="flex-1 border border-[color:var(--hairline)] px-3 py-1.5 text-center font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--foreground)]">View profile</Link>
                <button className="border border-[color:var(--hairline)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--amber)] hover:text-[color:var(--amber)]">Follow</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}
