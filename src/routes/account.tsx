import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader, SectionLabel } from "@/components/site";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: AccountPage,
});

function AccountPage() {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  return (
    <Shell>
      <PageHeader eyebrow="// account · settings" title={<>Your seat in the studio.</>} />
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="sticky top-24 space-y-1 border border-[color:var(--hairline)] p-2 font-mono text-[11px] uppercase tracking-widest">
            {["Profile","Role","Security","Notifications","Billing","Payouts","Sessions","API keys"].map((t, i) => (
              <a key={t} href="#" className={"block px-3 py-2 hover:bg-[color:var(--surface)] " + (i===0?"bg-[color:var(--surface)] text-[color:var(--cyan)]":"text-[color:var(--mute)]")}>{t}</a>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-9 space-y-10">
          <section className="border border-[color:var(--hairline)] p-6">
            <SectionLabel>// role</SectionLabel>
            <p className="text-sm text-[color:var(--foreground)]/85">You can switch modes any time. Your library and follows stay put.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(["buyer","seller"] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={"border p-5 text-left transition-colors " + (role===r?"border-[color:var(--amber)] bg-[color:var(--surface)]":"border-[color:var(--hairline)] hover:border-[color:var(--foreground)]")}>
                  <div className="font-display text-2xl capitalize">{r}</div>
                  <p className="mt-1 text-sm text-[color:var(--mute)]">
                    {r === "buyer" ? "Browse, buy, download, review. Follow creators you love." : "Upload and sell your work. Keep 85%. Get paid Friday."}
                  </p>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-widest">
                    {role===r ? <span className="text-[color:var(--amber)]">Active</span> : <span className="text-[color:var(--mute)]">Switch</span>}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="border border-[color:var(--hairline)] p-6">
            <SectionLabel>// profile</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Display name</span>
                <input defaultValue="Krystl" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
              <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Handle</span>
                <input defaultValue="@krystl" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono outline-none focus:border-[color:var(--cyan)]" /></label>
              <label className="sm:col-span-2"><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Bio</span>
                <textarea rows={3} defaultValue="Editor turned toolmaker." className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
            </div>
            <button className="mt-4 border border-[color:var(--amber)] bg-[color:var(--amber)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]">Save changes</button>
          </section>

          <section className="border border-[color:var(--hairline)] p-6">
            <SectionLabel>// security</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Email</span>
                <input defaultValue="you@krystl.studio" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 outline-none focus:border-[color:var(--cyan)]" /></label>
              <label><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">2FA</span>
                <select className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2"><option className="bg-[color:var(--surface)]">Authenticator app</option><option className="bg-[color:var(--surface)]">SMS</option><option className="bg-[color:var(--surface)]">Off</option></select></label>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
