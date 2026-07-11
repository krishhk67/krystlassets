import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/site";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const nav = useNavigate();
  return (
    <Shell noTicker>
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(50% 60% at 20% 20%, color-mix(in oklab, var(--cyan) 22%, transparent), transparent 60%), radial-gradient(60% 60% at 90% 30%, color-mix(in oklab, var(--magenta) 22%, transparent), transparent 60%)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] scanlines" />
        <div className="relative mx-auto grid max-w-[1200px] gap-16 px-6 py-16 md:grid-cols-2 md:items-center">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// {mode === "signup" ? "join" : "return"} · krystlassets</div>
            <h1 className="mt-4 rgb-split font-display text-6xl md:text-7xl">
              <span className="rgb-split-layer split-cyan" aria-hidden>krystlassets</span>
              <span className="rgb-split-layer split-magenta" aria-hidden>krystlassets</span>
              <span className="relative">krystlassets</span>
            </h1>
            <p className="mt-6 max-w-md text-[color:var(--foreground)]/80">
              A marketplace where cutters buy the packs they actually reach for, and creators get paid on Friday.
            </p>
            <ul className="mt-8 space-y-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
              <li>· 14,382 assets across 16 categories</li>
              <li>· 3,914 verified creators</li>
              <li>· 85% seller payout · weekly withdrawals</li>
            </ul>
          </div>

          <div className="border border-[color:var(--hairline)] bg-[color:var(--surface)]/80 p-8 backdrop-blur">
            <div className="mb-6 flex gap-2 font-mono text-[11px] uppercase tracking-widest">
              {(["signup","signin"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={"border px-3 py-1.5 " + (mode===m?"border-[color:var(--cyan)] text-[color:var(--cyan)]":"border-[color:var(--hairline)] text-[color:var(--mute)]")}>
                  {m === "signup" ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            {mode === "signup" && (
              <div className="mb-6">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">// I'm here to</div>
                <div className="grid grid-cols-2 gap-2">
                  {(["buyer","seller"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={"border p-4 text-left " + (role===r?"border-[color:var(--amber)] bg-[color:var(--surface-2)]":"border-[color:var(--hairline)] hover:border-[color:var(--foreground)]")}>
                      <div className="font-display text-lg capitalize">{r}</div>
                      <div className="mt-1 font-mono text-[10px] text-[color:var(--mute)]">
                        {r === "buyer" ? "browse & buy" : "upload & sell"}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mt-2 font-mono text-[10px] text-[color:var(--mute)]">You can switch modes any time from settings.</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); nav({ to: role === "seller" && mode === "signup" ? "/dashboard" : "/marketplace" }); }} className="space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Handle</span>
                  <input required placeholder="@yourname" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)]" />
                </label>
              )}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Email</span>
                <input required type="email" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Password</span>
                <input required type="password" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" />
              </label>
              <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] hover:-translate-y-0.5 transition-transform">
                {mode === "signup" ? "Create account" : "Sign in"} <span>→</span>
              </button>
              <div className="grid grid-cols-3 gap-2">
                {["Google","GitHub","Apple"].map(p => (
                  <button key={p} type="button" className="border border-[color:var(--hairline)] px-3 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--foreground)]">{p}</button>
                ))}
              </div>
            </form>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              By continuing you agree to the <Link to="/terms" className="hair-link">terms</Link> and <Link to="/privacy" className="hair-link">privacy</Link>.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
