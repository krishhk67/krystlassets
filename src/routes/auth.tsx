import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/site";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              handle: handle || undefined,
              display_name: handle || email.split("@")[0],
              mode: role,
            },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to Krystlassets.");
        nav({ to: role === "seller" ? "/dashboard" : "/marketplace" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
        nav({ to: "/marketplace" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something didn't line up. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed.");
        return;
      }
      if (result.redirected) return;
      toast.success("Signed in with Google.");
      nav({ to: "/marketplace" });
    } finally {
      setLoading(false);
    }
  }

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
                <button key={m} type="button" onClick={() => setMode(m)}
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

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Handle</span>
                  <input value={handle} onChange={(e) => setHandle(e.target.value)} required placeholder="@yourname" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)]" />
                </label>
              )}
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Email</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Password</span>
                <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" minLength={6} className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" />
              </label>
              <button type="submit" disabled={loading} className="mt-2 flex w-full items-center justify-center gap-2 bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] hover:-translate-y-0.5 transition-transform disabled:opacity-60">
                {loading ? "..." : mode === "signup" ? "Create account" : "Sign in"} <span>→</span>
              </button>
              <button type="button" onClick={onGoogle} disabled={loading} className="w-full border border-[color:var(--hairline)] px-3 py-2 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--foreground)] disabled:opacity-60">
                Continue with Google
              </button>
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
