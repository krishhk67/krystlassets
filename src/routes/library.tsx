import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Library — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const owned = assets.slice(0, 5);
  return (
    <Shell>
      <PageHeader
        eyebrow="// account · library"
        title={<>Yours to keep. <em className="not-italic text-[color:var(--cyan)]">Forever.</em></>}
        sub="Every purchase, ready to redownload. Updates are free for life."
      />
      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-widest">
          {["All","Overlays","LUTs","SFX","Motion","Recent"].map((t, i) => (
            <button key={t} className={"border px-3 py-1.5 " + (i===0?"border-[color:var(--cyan)] text-[color:var(--cyan)]":"border-[color:var(--hairline)] text-[color:var(--mute)] hover:text-[color:var(--foreground)]")}>{t}</button>
          ))}
          <span className="ml-auto text-[color:var(--mute)]">{owned.length} items · 8.4 GB</span>
        </div>
        <ul className="border border-[color:var(--hairline)] divide-y divide-[color:var(--hairline)]">
          {owned.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-4 p-4">
              <img src={a.img} alt="" className="h-16 w-28 object-cover" />
              <div className="min-w-0 flex-1">
                <Link to="/asset/$slug" params={{ slug: a.slug }} className="font-display text-lg hair-link">{a.title}</Link>
                <div className="font-mono text-[11px] text-[color:var(--mute)]">v{a.version} · {a.size} · by {a.creator}</div>
              </div>
              <div className="hidden md:block font-mono text-[11px] text-[color:var(--mute)]">purchased 12 Jan · order #A-1029</div>
              <button className="border border-[color:var(--hairline)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--foreground)]">Invoice</button>
              <button className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--ink)]">Download</button>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
