import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader, AssetGrid } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/free")({
  head: () => ({ meta: [{ title: "Free assets — Krystlassets" }, { name: "description", content: "Free overlays, LUTs, SFX and motion for editors." }] }),
  component: FreePage,
});

function FreePage() {
  const items = assets.filter(a => a.price === 0);
  return (
    <Shell>
      <PageHeader
        eyebrow="// free · no strings"
        title={<>Free packs, <em className="not-italic text-[color:var(--cyan)]">production-ready</em>.</>}
        sub="Every free asset ships at the same spec as our paid work. Commercial use allowed."
      />
      <div className="mx-auto max-w-[1400px] px-6 pb-24"><AssetGrid items={items} /></div>
    </Shell>
  );
}
