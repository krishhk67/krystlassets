import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Shell, Stars, Chip, CreatorAvatar, Verified, AssetGrid, SectionLabel } from "@/components/site";
import { getAssetBySlug } from "@/lib/catalog.functions";
import { addToCart, toggleWishlist, getMyWishlist } from "@/lib/user.functions";
import { withImg } from "@/lib/img";
import { sampleReviews, type Tint } from "@/lib/mock";
import { useSession } from "@/hooks/useSession";

const assetQueryOptions = (fn: ReturnType<typeof useServerFn<typeof getAssetBySlug>>, slug: string) =>
  queryOptions({
    queryKey: ["asset", slug],
    queryFn: async () => {
      const res = await fn({ data: { slug } });
      if (!res) return null;
      return {
        asset: withImg(res.asset),
        creator: res.creator,
        related: res.related.map(withImg),
        moreFrom: res.moreFrom.map(withImg),
      };
    },
    staleTime: 60_000,
  });

export const Route = createFileRoute("/asset/$slug")({
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      queryOptions({
        queryKey: ["asset", params.slug],
        queryFn: async () => {
          const res = await getAssetBySlug({ data: { slug: params.slug } });
          if (!res) return null;
          return {
            asset: withImg(res.asset),
            creator: res.creator,
            related: res.related.map(withImg),
            moreFrom: res.moreFrom.map(withImg),
          };
        },
      }),
    );
    if (!data) throw notFound();
    return { title: data.asset.title, description: data.asset.description ?? "", img: data.asset.img };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Krystlassets` },
          { name: "description", content: loaderData.description || `${loaderData.title} on Krystlassets.` },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.description || "" },
          { property: "og:image", content: loaderData.img },
        ]
      : [{ title: "Asset — Krystlassets" }, { name: "robots", content: "noindex" }],
  }),
  component: AssetPage,
  notFoundComponent: AssetNotFound,
  errorComponent: ({ error }) => (
    <Shell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// asset · error</div>
        <h1 className="mt-4 font-display text-4xl">This clip won't load.</h1>
        <p className="mt-4 font-mono text-sm text-[color:var(--mute)]">{error.message}</p>
        <Link to="/marketplace" className="mt-8 inline-flex border border-[color:var(--cyan)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">Back to marketplace</Link>
      </div>
    </Shell>
  ),
});

function AssetNotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// asset · not found</div>
        <h1 className="mt-4 font-display text-5xl">This clip isn't in the bin.</h1>
        <p className="mt-4 text-[color:var(--mute)]">It was pulled, renamed, or never existed.</p>
        <Link to="/marketplace" className="mt-8 inline-flex border border-[color:var(--cyan)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">Back to marketplace</Link>
      </div>
    </Shell>
  );
}

function AssetPage() {
  const { slug } = Route.useParams();
  const fn = useServerFn(getAssetBySlug);
  const { data } = useSuspenseQuery(assetQueryOptions(fn, slug));
  const [tab, setTab] = useState<"overview" | "reviews" | "changelog" | "license">("overview");
  const { isAuthed } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const wishlist = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getMyWishlist(),
    enabled: isAuthed,
  });
  const inWishlist = !!wishlist.data?.some((w) => w.asset_id === data?.asset.id);

  const addCart = useMutation({
    mutationFn: (asset_id: string) => addToCart({ data: { asset_id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
  });
  const toggleWish = useMutation({
    mutationFn: (asset_id: string) => toggleWishlist({ data: { asset_id } }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success(res.saved ? "Saved to wishlist" : "Removed from wishlist");
    },
  });

  if (!data) return <AssetNotFound />;
  const { asset: a, creator, related, moreFrom } = data;
  const priceLabel = a.price === 0 ? "Free" : `$${a.price}`;

  const requireAuth = () => {
    if (!isAuthed) {
      toast("Sign in to keep your cart across sessions.");
      navigate({ to: "/auth" });
      return false;
    }
    return true;
  };

  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-6 pt-10">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">
          <Link to="/marketplace" className="hair-link">marketplace</Link> / <span className="text-[color:var(--foreground)]">{a.kind}</span> / {a.title}
        </div>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] overflow-hidden border border-[color:var(--hairline)] bg-[color:var(--surface)]">
              <img src={a.img} alt={a.title} className="h-full w-full object-cover" />
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 scanlines" />
              <div className="absolute left-3 top-3 flex items-center gap-2 bg-[color:var(--ink)]/70 px-2 py-1 font-mono text-[10px] tracking-wider backdrop-blur">
                <span className="h-1.5 w-1.5" style={{ background: `var(--${a.tint})` }} />{a.tc}
              </div>
              <button className="absolute inset-x-6 bottom-6 flex items-center justify-between border border-[color:var(--hairline)] bg-[color:var(--ink)]/70 px-4 py-3 font-mono text-[11px] uppercase tracking-widest backdrop-blur hover:border-[color:var(--amber)]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--amber)] live-dot" /> Play preview
                </span>
                <span>{a.size} · {a.kind}</span>
              </button>
              <div className="waveform absolute inset-x-0 bottom-0 h-6 opacity-60" style={{ ["--wf-color" as string]: `var(--${a.tint})` }} />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[a.img, a.img, a.img, a.img].map((src, i) => (
                <div key={i} className="relative aspect-[16/10] overflow-hidden border border-[color:var(--hairline)]">
                  <img src={src} alt="" className="h-full w-full object-cover opacity-80 hover:opacity-100" />
                </div>
              ))}
            </div>

            <div className="mt-10 border-b border-[color:var(--hairline)]">
              <div className="flex gap-6">
                {(["overview","reviews","changelog","license"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={"pb-3 font-mono text-[11px] uppercase tracking-widest " + (tab === t ? "border-b-2 border-[color:var(--cyan)] text-[color:var(--foreground)]" : "text-[color:var(--mute)] hover:text-[color:var(--foreground)]")}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {tab === "overview" && (
              <div className="mt-6 space-y-6 text-sm leading-relaxed text-[color:var(--foreground)]/85">
                <p>{a.description || `A pack of ${a.category.toLowerCase()} designed for ${a.software.join(", ")}. Every element is loopable, timeline-safe, and delivered at broadcast spec. Zero watermarks, zero seams.`}</p>
                <div>
                  <SectionLabel>// what's inside</SectionLabel>
                  <ul className="grid gap-2 sm:grid-cols-2 font-mono text-[11px]">
                    {["48 loopable clips","4K ProRes 422 HQ","MP4 H.264 mirrors","MOGRT + AE .aep","LUT .cube (Rec.709 / Log-C)","Documentation.pdf"].map((s) => (
                      <li key={s} className="flex items-center gap-2 border border-[color:var(--hairline)] px-3 py-2">
                        <span className="h-1.5 w-1.5" style={{ background: `var(--${a.tint})` }} />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <SectionLabel>// compatibility</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {a.software.map((s: string) => <Chip key={s}>{s}</Chip>)}
                    <Chip tint="cyan">macOS</Chip><Chip tint="cyan">Windows</Chip>
                  </div>
                </div>
                <div>
                  <SectionLabel>// tags</SectionLabel>
                  <div className="flex flex-wrap gap-2">{a.tags.map((t: string) => <Chip key={t}>{t}</Chip>)}</div>
                </div>
              </div>
            )}

            {tab === "reviews" && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-6 border border-[color:var(--hairline)] p-6">
                  <div>
                    <div className="font-display text-5xl">{a.rating.toFixed(1)}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">{a.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5,4,3,2,1].map((n) => (
                      <div key={n} className="flex items-center gap-3 font-mono text-[10px] text-[color:var(--mute)]">
                        <span className="w-3">{n}</span>
                        <div className="h-1.5 flex-1 bg-[color:var(--surface-2)]">
                          <div className="h-full bg-[color:var(--amber)]" style={{ width: `${n===5?78:n===4?16:n===3?4:n===2?1:1}%` }} />
                        </div>
                        <span className="w-8 text-right">{n===5?78:n===4?16:n===3?4:n===2?1:1}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <ul className="space-y-4">
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
              </div>
            )}

            {tab === "changelog" && (
              <ul className="mt-6 space-y-3 font-mono text-[12px]">
                {[{v:a.version,d:"today",n:"Added 12 clips at 6K, refreshed docs."},{v:"2.0.0",d:"3 weeks ago",n:"Rebuilt from source. All loops now seamless."},{v:"1.4.2",d:"2 months ago",n:"Fixed edge flicker on 4th clip."},{v:"1.0.0",d:"1 year ago",n:"Initial release."}].map((c) => (
                  <li key={c.v} className="flex items-start gap-4 border-l-2 border-[color:var(--cyan)] pl-4">
                    <span className="text-[color:var(--cyan)]">v{c.v}</span>
                    <span className="text-[color:var(--mute)]">{c.d}</span>
                    <span className="text-[color:var(--foreground)]/85">{c.n}</span>
                  </li>
                ))}
              </ul>
            )}

            {tab === "license" && (
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[color:var(--foreground)]/85">
                <p><span className="text-[color:var(--foreground)]">Standard license</span> — use in unlimited personal and client projects. No redistribution of raw files.</p>
                <p><span className="text-[color:var(--foreground)]">Commercial license</span> — everything above, plus use in broadcast, ads, and SaaS product interfaces.</p>
                <p>Support included for 12 months from purchase. Updates free for life.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
                <div className="flex items-baseline justify-between">
                  <div className="font-display text-4xl tracking-tight">{priceLabel}</div>
                  {a.originalPrice && <div className="font-mono text-sm text-[color:var(--mute)] line-through">${a.originalPrice}</div>}
                </div>
                <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-[color:var(--mute)]">
                  <Stars value={a.rating} /> <span>·</span> <span>{a.reviews} reviews</span> <span>·</span> <span>{a.downloads} dl</span>
                </div>
                <Link to="/cart" className="mt-6 flex items-center justify-center gap-2 bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] hover:-translate-y-0.5 transition-transform">
                  Add to cart <span>→</span>
                </Link>
                <Link to="/checkout" className="mt-2 flex items-center justify-center gap-2 border border-[color:var(--hairline)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)] hover:text-[color:var(--cyan)]">
                  Buy now
                </Link>
                <button className="mt-2 flex w-full items-center justify-center gap-2 border border-[color:var(--hairline)] px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)] hover:text-[color:var(--foreground)]">
                  ♡ Wishlist
                </button>
                <dl className="mt-6 grid grid-cols-2 gap-y-2 font-mono text-[11px]">
                  <dt className="text-[color:var(--mute)]">Version</dt><dd>{a.version}</dd>
                  <dt className="text-[color:var(--mute)]">Updated</dt><dd>{a.updated}</dd>
                  <dt className="text-[color:var(--mute)]">Size</dt><dd>{a.size}</dd>
                  <dt className="text-[color:var(--mute)]">Category</dt><dd>{a.category}</dd>
                </dl>
              </div>

              {creator && (
                <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)] p-5">
                  <Link to="/creator/$handle" params={{ handle: creator.handle }} className="flex items-center gap-3">
                    <CreatorAvatar tint={creator.tint as Tint} size={44} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg">{creator.name}</span>
                        {creator.verified && <Verified tint={creator.tint as Tint} />}
                      </div>
                      <div className="font-mono text-[11px] text-[color:var(--mute)]">@{creator.handle} · {creator.followers} followers</div>
                    </div>
                    <button className="border border-[color:var(--hairline)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--amber)] hover:text-[color:var(--amber)]">Follow</button>
                  </Link>
                  <p className="mt-4 text-sm text-[color:var(--foreground)]/85">{creator.bio}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div><div>{creator.published}</div><div className="text-[10px] uppercase tracking-widest text-[color:var(--mute)]">assets</div></div>
                    <div><div>{creator.sales}</div><div className="text-[10px] uppercase tracking-widest text-[color:var(--mute)]">sales</div></div>
                    <div><div>{Number(creator.rating).toFixed(1)} ★</div><div className="text-[10px] uppercase tracking-widest text-[color:var(--mute)]">rating</div></div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {moreFrom.length > 0 && (
          <section className="mt-24">
            <SectionLabel>// more from {a.creator}</SectionLabel>
            <AssetGrid items={moreFrom} />
          </section>
        )}
        {related.length > 0 && (
          <section className="mt-16 pb-16">
            <SectionLabel>// frequently bought together</SectionLabel>
            <AssetGrid items={related} />
          </section>
        )}
      </div>
    </Shell>
  );
}
