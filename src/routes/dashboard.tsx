import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Shell, SectionLabel, Chip } from "@/components/site";
import { useSession } from "@/hooks/useSession";
import {
  listMyAssets,
  getMyDashboardStats,
  deleteMyAsset,
  updateMyAsset,
} from "@/lib/creator.functions";
import { resolveImg } from "@/lib/img";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Krystlassets" }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <Shell>
      <div className="border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/40">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-3 overflow-x-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
            // creator studio
          </span>
          {[
            ["Overview", "/dashboard"],
            ["Upload", "/dashboard/upload"],
            ["Settings", "/account"],
          ].map(([l, h], i) => (
            <Link
              key={l}
              to={h as string}
              className={
                "font-mono text-[11px] uppercase tracking-widest " +
                (i === 0
                  ? "text-[color:var(--cyan)]"
                  : "text-[color:var(--mute)] hover:text-[color:var(--foreground)]")
              }
            >
              {l}
            </Link>
          ))}
        </div>
      </div>
      <Outlet />
      <DashboardOverview />
    </Shell>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(Math.round(n));
}

function DashboardOverview() {
  const { isAuthed, user, loading } = useSession();
  const nav = useNavigate();
  const qc = useQueryClient();
  const listFn = useServerFn(listMyAssets);
  const statsFn = useServerFn(getMyDashboardStats);
  const delFn = useServerFn(deleteMyAsset);
  const updFn = useServerFn(updateMyAsset);

  useEffect(() => {
    if (!loading && !isAuthed) nav({ to: "/auth" });
  }, [loading, isAuthed, nav]);

  const assetsQ = useQuery({
    queryKey: ["my-assets", user?.id],
    queryFn: () => listFn(),
    enabled: isAuthed,
  });
  const statsQ = useQuery({
    queryKey: ["my-dashboard", user?.id],
    queryFn: () => statsFn(),
    enabled: isAuthed,
  });

  const del = useMutation({
    mutationFn: (id: string) => delFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Asset deleted.");
      qc.invalidateQueries({ queryKey: ["my-assets"] });
      qc.invalidateQueries({ queryKey: ["my-dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const togglePublish = useMutation({
    mutationFn: (v: { id: string; status: "draft" | "published" }) =>
      updFn({ data: { id: v.id, status: v.status } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-assets"] });
      qc.invalidateQueries({ queryKey: ["my-dashboard"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const stats = statsQ.data;
  const assets = assetsQ.data ?? [];

  const cards = [
    { k: String(stats?.total ?? 0), v: "Total assets", tint: "cyan" as const },
    { k: String(stats?.published ?? 0), v: "Published", tint: "amber" as const },
    { k: String(stats?.drafts ?? 0), v: "Drafts", tint: "magenta" as const },
    { k: formatCount(stats?.totalDownloads ?? 0), v: "Downloads", tint: "cyan" as const },
    { k: String(stats?.reviews ?? 0), v: "Reviews", tint: "amber" as const },
    {
      k: (stats?.avgRating ?? 0).toFixed(1) + " ★",
      v: "Avg rating",
      tint: "magenta" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel>// dashboard · creator studio</SectionLabel>
          <h1 className="font-display text-4xl md:text-5xl">
            Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}.
          </h1>
          <p className="mt-2 text-[color:var(--mute)]">
            Manage your catalog, ship new packs, and track your work.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/upload"
            className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]"
          >
            + New upload
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px border border-[color:var(--hairline)] bg-[color:var(--hairline)] md:grid-cols-3 lg:grid-cols-6">
        {cards.map((s) => (
          <div key={s.v} className="bg-[color:var(--surface)]/70 p-5">
            <div
              className="font-display text-2xl tracking-tight"
              style={{ color: `var(--${s.tint})` }}
            >
              {s.k}
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <SectionLabel>// your assets</SectionLabel>
          {assetsQ.isLoading && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              loading…
            </span>
          )}
        </div>

        {assets.length === 0 && !assetsQ.isLoading ? (
          <div className="border border-dashed border-[color:var(--hairline)] p-12 text-center">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              // empty
            </div>
            <h2 className="mt-3 font-display text-2xl">No assets yet.</h2>
            <p className="mt-2 text-sm text-[color:var(--mute)]">
              Ship your first pack — it takes a few minutes.
            </p>
            <Link
              to="/dashboard/upload"
              className="mt-6 inline-block border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]"
            >
              Upload asset
            </Link>
          </div>
        ) : (
          <div className="border border-[color:var(--hairline)]">
            <div className="hidden md:grid grid-cols-8 gap-4 border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/50 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              <span className="col-span-3">Title</span>
              <span>Status</span>
              <span>Price</span>
              <span>Downloads</span>
              <span>Rating</span>
              <span></span>
            </div>
            {assets.map((a) => {
              const img =
                a.img_url && a.img_url.length > 0 ? a.img_url : resolveImg(a.img_key ?? "lightleaks");
              const published = a.status === "published";
              return (
                <div
                  key={a.id}
                  className="grid grid-cols-2 md:grid-cols-8 gap-4 border-b border-[color:var(--hairline)] px-5 py-4 last:border-b-0 text-sm items-center"
                >
                  <div className="col-span-2 md:col-span-3 flex items-center gap-3 min-w-0">
                    <img
                      src={img}
                      alt=""
                      className="h-10 w-16 object-cover border border-[color:var(--hairline)]"
                    />
                    <div className="min-w-0">
                      <Link
                        to="/asset/$slug"
                        params={{ slug: a.slug }}
                        className="block truncate hover:text-[color:var(--cyan)]"
                      >
                        {a.title}
                      </Link>
                      <div className="font-mono text-[10px] text-[color:var(--mute)]">
                        v{a.version} · {a.kind}
                      </div>
                    </div>
                  </div>
                  <span>
                    <Chip tint={published ? "cyan" : "magenta"}>
                      {published ? "Published" : "Draft"}
                    </Chip>
                  </span>
                  <span className="font-mono">
                    {Number(a.price) === 0 ? "Free" : `$${Number(a.price).toFixed(0)}`}
                  </span>
                  <span className="font-mono">{a.downloads || "0"}</span>
                  <span className="font-mono">{Number(a.rating ?? 0).toFixed(1)} ★</span>
                  <span className="flex gap-3 justify-end">
                    <button
                      onClick={() =>
                        togglePublish.mutate({
                          id: a.id,
                          status: published ? "draft" : "published",
                        })
                      }
                      className="hair-link text-[color:var(--mute)] hover:text-[color:var(--foreground)]"
                    >
                      {published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${a.title}"? This cannot be undone.`)) {
                          del.mutate(a.id);
                        }
                      }}
                      className="hair-link text-[color:var(--mute)] hover:text-[color:var(--magenta)]"
                    >
                      Delete
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
