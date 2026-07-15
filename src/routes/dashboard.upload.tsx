import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Shell, SectionLabel } from "@/components/site";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { createMyAsset } from "@/lib/creator.functions";

export const Route = createFileRoute("/dashboard/upload")({
  head: () => ({
    meta: [{ title: "Upload — Krystlassets" }, { name: "robots", content: "noindex" }],
  }),
  component: UploadPage,
});

const CATEGORIES = [
  "Overlays",
  "LUTs",
  "SFX",
  "Presets",
  "Motion Graphics",
  "Transitions",
  "3D Assets",
  "PNG",
  "Fonts",
  "Textures",
  "Brushes",
  "Icons",
  "Music",
  "Stock Videos",
  "Project Files",
];

const SOFTWARE = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Final Cut",
  "Photoshop",
  "Lightroom",
  "Blender",
  "C4D",
  "Houdini",
  "Figma",
];

const KIND_BY_CATEGORY: Record<string, string> = {
  Overlays: "OVERLAYS",
  LUTs: "LUTS",
  SFX: "SFX",
  Presets: "PRESETS",
  "Motion Graphics": "MOTION",
  Transitions: "TRANSITIONS",
  "3D Assets": "3D",
  PNG: "PNG",
  Fonts: "FONTS",
  Textures: "TEXTURES",
  Brushes: "BRUSHES",
  Icons: "ICONS",
  Music: "MUSIC",
  "Stock Videos": "STOCK",
  "Project Files": "PROJECT",
};

function UploadPage() {
  const { isAuthed, user, loading } = useSession();
  const nav = useNavigate();
  const qc = useQueryClient();
  const create = useServerFn(createMyAsset);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Overlays");
  const [software, setSoftware] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [size, setSize] = useState("");
  const [tint, setTint] = useState<"cyan" | "magenta" | "amber">("cyan");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [free, setFree] = useState(false);
  const [price, setPrice] = useState<number>(28);
  const [originalPrice, setOriginalPrice] = useState<number | "">("");
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (nextStatus: "draft" | "published") => {
      if (!user) throw new Error("Not signed in");
      if (!title.trim()) throw new Error("Title is required");

      let img_url = "";
      if (thumbFile) {
        setUploading(true);
        const ext = thumbFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${Date.now().toString(36)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("asset-thumbnails")
          .upload(path, thumbFile, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        // Private bucket: mint a very-long-lived signed URL and store it.
        const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
        const { data: signed, error: signErr } = await supabase.storage
          .from("asset-thumbnails")
          .createSignedUrl(path, TEN_YEARS);
        if (signErr) throw signErr;
        img_url = signed?.signedUrl ?? "";
        setUploading(false);
      }

      return create({
        data: {
          title: title.trim(),
          description: description.trim(),
          category,
          kind: KIND_BY_CATEGORY[category] ?? category.toUpperCase(),
          software,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          price: free ? 0 : Number(price) || 0,
          originalPrice: originalPrice === "" ? null : Number(originalPrice),
          version,
          size,
          tint,
          img_url,
          status: nextStatus,
        },
      });
    },
    onSuccess: (_res, nextStatus) => {
      toast.success(nextStatus === "published" ? "Asset published." : "Draft saved.");
      qc.invalidateQueries({ queryKey: ["my-assets"] });
      qc.invalidateQueries({ queryKey: ["my-dashboard"] });
      nav({ to: "/dashboard" });
    },
    onError: (err: unknown) => {
      setUploading(false);
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    },
  });

  function toggleSoftware(name: string) {
    setSoftware((s) => (s.includes(name) ? s.filter((x) => x !== name) : [...s, name]));
  }

  function onThumbChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbFile(f);
    const url = URL.createObjectURL(f);
    setThumbPreview(url);
  }

  if (!loading && !isAuthed) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
          <SectionLabel>// sign in required</SectionLabel>
          <h1 className="font-display text-3xl">Sign in to upload assets.</h1>
          <Link
            to="/auth"
            className="mt-6 inline-block border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]"
          >
            Sign in
          </Link>
        </div>
      </Shell>
    );
  }

  const busy = mutation.isPending || uploading;

  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <SectionLabel>// upload · new asset</SectionLabel>
            <h1 className="font-display text-4xl md:text-5xl">Ship your next pack.</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--foreground)]"
            >
              Cancel
            </Link>
            <button
              disabled={busy}
              onClick={() => mutation.mutate("draft")}
              className="border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)] disabled:opacity-40"
            >
              {busy ? "Saving…" : "Save draft"}
            </button>
            <button
              disabled={busy}
              onClick={() => mutation.mutate("published")}
              className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] disabled:opacity-60"
            >
              {busy ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 01 · details</SectionLabel>
              <div className="grid gap-4">
                <label>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                    Title
                  </span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Anamorphic Light Leaks — Vol.03"
                    className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]"
                  />
                </label>
                <label>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                    Description
                  </span>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's in the box, how it sits in the timeline, what makes it different."
                    className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                      Category
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} className="bg-[color:var(--surface)]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                      Software
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {SOFTWARE.map((s) => {
                        const on = software.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleSoftware(s)}
                            className={
                              "border px-2 py-1 font-mono text-[10px] uppercase tracking-widest " +
                              (on
                                ? "border-[color:var(--cyan)] text-[color:var(--cyan)]"
                                : "border-[color:var(--hairline)] text-[color:var(--mute)] hover:border-[color:var(--foreground)]")
                            }
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <label>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                    Tags · comma separated
                  </span>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="light leaks, anamorphic, 4k, film"
                    className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 02 · thumbnail</SectionLabel>
              <label className="block aspect-[16/9] cursor-pointer border border-dashed border-[color:var(--hairline)] p-4 hover:border-[color:var(--cyan)] relative overflow-hidden">
                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                      Thumbnail
                    </div>
                    <div className="mt-2 text-sm text-[color:var(--foreground)]/70">
                      Click to upload · 16:9 recommended, up to 5MB
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onThumbChange}
                />
              </label>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                Downloadable files coming soon — for now just describe your pack.
              </p>
            </fieldset>

            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 03 · version</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                    Version
                  </span>
                  <input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="2.1.0"
                    className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)]"
                  />
                </label>
                <label>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                    Pack size (display)
                  </span>
                  <input
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="3.8 GB"
                    className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]"
                  />
                </label>
              </div>
            </fieldset>
          </div>

          <aside className="space-y-6">
            <div className="border border-[color:var(--hairline)] p-5">
              <SectionLabel>// pricing</SectionLabel>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={free}
                  onChange={(e) => setFree(e.target.checked)}
                />{" "}
                Free asset
              </label>
              <label className="mt-3 block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                  Price (USD)
                </span>
                <input
                  type="number"
                  disabled={free}
                  value={free ? 0 : price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)] disabled:opacity-40"
                />
              </label>
              <label className="mt-3 block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                  Original price (for sale)
                </span>
                <input
                  type="number"
                  disabled={free}
                  value={originalPrice}
                  onChange={(e) =>
                    setOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)] disabled:opacity-40"
                />
              </label>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                You keep 85% · Platform 15%
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] p-5">
              <SectionLabel>// accent</SectionLabel>
              <div className="flex gap-2">
                {(["cyan", "magenta", "amber"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTint(t)}
                    className={
                      "flex-1 border px-3 py-2 font-mono text-[10px] uppercase tracking-widest " +
                      (tint === t
                        ? "border-[color:var(--foreground)]"
                        : "border-[color:var(--hairline)] text-[color:var(--mute)]")
                    }
                    style={{ color: `var(--${t})` }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] p-5">
              <SectionLabel>// visibility</SectionLabel>
              <div className="flex gap-2">
                {(["draft", "published"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={
                      "border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest " +
                      (status === s
                        ? "border-[color:var(--amber)] text-[color:var(--amber)]"
                        : "border-[color:var(--hairline)] text-[color:var(--mute)]")
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-[color:var(--mute)]">
                Published assets appear on the marketplace immediately.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
