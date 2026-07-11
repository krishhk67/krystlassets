import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SectionLabel } from "@/components/site";

export const Route = createFileRoute("/dashboard/upload")({
  head: () => ({ meta: [{ title: "Upload — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: UploadPage,
});

function UploadPage() {
  const [status, setStatus] = useState<"draft" | "publish">("draft");
  const [free, setFree] = useState(false);
  return (
    <Shell>
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <SectionLabel>// upload · new asset</SectionLabel>
            <h1 className="font-display text-4xl md:text-5xl">Ship your next pack.</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard" className="border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--foreground)]">Cancel</Link>
            <button className="border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)]" onClick={() => setStatus("draft")}>Save draft</button>
            <button className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]" onClick={() => setStatus("publish")}>Publish</button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 01 · details</SectionLabel>
              <div className="grid gap-4">
                <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Title</span>
                  <input placeholder="Anamorphic Light Leaks — Vol.03" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
                <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Description</span>
                  <textarea rows={4} placeholder="What's in the box, how it sits in the timeline, what makes it different." className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Category</span>
                    <select className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2">
                      {["Overlays","LUTs","SFX","Presets","Motion Graphics","Transitions","3D Assets","PNG","Fonts","Textures","Brushes","Icons","Music","Stock Videos","Project Files"].map(c => <option key={c} className="bg-[color:var(--surface)]">{c}</option>)}
                    </select></label>
                  <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Software</span>
                    <select multiple className="mt-1 h-24 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2">
                      {["Premiere Pro","After Effects","DaVinci Resolve","Final Cut","Photoshop","Lightroom","Blender","C4D","Houdini","Figma"].map(c => <option key={c} className="bg-[color:var(--surface)]">{c}</option>)}
                    </select></label>
                </div>
                <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Tags · comma separated</span>
                  <input placeholder="light leaks, anamorphic, 4k, film" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
              </div>
            </fieldset>

            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 02 · media</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-3">
                {["Thumbnail","Gallery","Preview video"].map((l) => (
                  <div key={l} className="aspect-[16/10] border border-dashed border-[color:var(--hairline)] p-4 hover:border-[color:var(--cyan)] flex flex-col items-center justify-center text-center">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">{l}</div>
                    <div className="mt-2 text-sm text-[color:var(--foreground)]/70">Drop file or click to upload</div>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 03 · files</SectionLabel>
              <div className="aspect-[3/1] border border-dashed border-[color:var(--hairline)] p-8 hover:border-[color:var(--amber)] flex flex-col items-center justify-center text-center">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Drop .zip or folder</div>
                <div className="mt-2 text-sm text-[color:var(--foreground)]/70">We'll scan for structure and generate the file manifest.</div>
                <button className="mt-4 border border-[color:var(--hairline)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--foreground)]">Choose file</button>
              </div>
            </fieldset>

            <fieldset className="border border-[color:var(--hairline)] p-6">
              <SectionLabel>// 04 · version & changelog</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2">
                <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Version</span>
                  <input placeholder="2.1.0" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)]" /></label>
                <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Supported versions</span>
                  <input placeholder="AE 2022+ · Premiere 24+" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
                <label className="sm:col-span-2"><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Changelog</span>
                  <textarea rows={3} placeholder="Added 12 clips at 6K. Refreshed documentation." className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
              </div>
            </fieldset>
          </div>

          <aside className="space-y-6">
            <div className="border border-[color:var(--hairline)] p-5">
              <SectionLabel>// pricing</SectionLabel>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={free} onChange={(e) => setFree(e.target.checked)} /> Free asset
              </label>
              <label className="mt-3 block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Price (USD)</span>
                <input type="number" disabled={free} defaultValue={28} className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)] disabled:opacity-40" />
              </label>
              <label className="mt-3 block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Discount price</span>
                <input type="number" disabled={free} className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)] disabled:opacity-40" />
              </label>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
                You keep 85% · Platform 15%
              </div>
            </div>

            <div className="border border-[color:var(--hairline)] p-5">
              <SectionLabel>// license</SectionLabel>
              <label className="mt-1 flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Standard license</label>
              <label className="mt-1 flex items-center gap-2 text-sm"><input type="checkbox" /> Commercial license (+40%)</label>
              <label className="mt-1 flex items-center gap-2 text-sm"><input type="checkbox" /> Extended broadcast</label>
            </div>

            <div className="border border-[color:var(--hairline)] p-5">
              <SectionLabel>// visibility</SectionLabel>
              <div className="flex gap-2">
                {(["draft","publish"] as const).map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={"border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest " + (status===s?"border-[color:var(--amber)] text-[color:var(--amber)]":"border-[color:var(--hairline)] text-[color:var(--mute)]")}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-[color:var(--mute)]">Published assets are reviewed within 12 hours.</p>
            </div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
