import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader, SectionLabel } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const [pay, setPay] = useState<"card" | "paypal" | "crypto">("card");
  const [done, setDone] = useState(false);
  const items = assets.slice(0, 2);
  const total = items.reduce((s, a) => s + a.price, 0);

  if (done) {
    return (
      <Shell>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--amber)]">// order · confirmed</div>
          <h1 className="mt-4 font-display text-5xl">Rolling now.</h1>
          <p className="mt-4 text-[color:var(--mute)]">Your files are in your library. A receipt is on its way.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/library" className="border border-[color:var(--amber)] bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]">Open library</Link>
            <Link to="/marketplace" className="border border-[color:var(--hairline)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-[color:var(--cyan)]">Keep browsing</Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHeader eyebrow="// checkout · secure · https" title={<>One click to your <em className="not-italic text-[color:var(--cyan)]">library</em>.</>} />
      <form
        onSubmit={(e) => { e.preventDefault(); setDone(true); }}
        className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 lg:grid-cols-12"
      >
        <div className="lg:col-span-7 space-y-8">
          <fieldset className="border border-[color:var(--hairline)] p-6">
            <SectionLabel>// 01 · contact</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Email</span>
                <input required type="email" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[color:var(--cyan)]" />
              </label>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Country</span>
                <select className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 text-sm">
                  {["United States","United Kingdom","Germany","Japan","Brazil","India","Portugal","Canada"].map(c => <option key={c} className="bg-[color:var(--surface)]">{c}</option>)}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className="border border-[color:var(--hairline)] p-6">
            <SectionLabel>// 02 · payment</SectionLabel>
            <div className="mb-4 flex gap-2">
              {(["card","paypal","crypto"] as const).map((p) => (
                <button type="button" key={p} onClick={() => setPay(p)}
                  className={"border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest " + (pay === p ? "border-[color:var(--cyan)] text-[color:var(--cyan)]" : "border-[color:var(--hairline)] text-[color:var(--mute)] hover:text-[color:var(--foreground)]")}>
                  {p}
                </button>
              ))}
            </div>
            {pay === "card" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2 block"><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Card number</span>
                  <input required placeholder="4242 4242 4242 4242" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--cyan)]" />
                </label>
                <label className="block"><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">Expiry</span>
                  <input required placeholder="MM/YY" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--cyan)]" /></label>
                <label className="block"><span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">CVC</span>
                  <input required placeholder="123" className="mt-1 w-full border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--cyan)]" /></label>
              </div>
            )}
            {pay === "paypal" && <div className="text-sm text-[color:var(--mute)]">You'll be redirected to PayPal to complete the payment.</div>}
            {pay === "crypto" && <div className="text-sm text-[color:var(--mute)]">Pay in BTC, ETH, USDC. Confirmation in ~2 minutes.</div>}
          </fieldset>

          <fieldset className="border border-[color:var(--hairline)] p-6">
            <SectionLabel>// 03 · license</SectionLabel>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" defaultChecked className="mt-1" />
              <span>Apply <span className="text-[color:var(--foreground)]">commercial license</span> to all items. Required for broadcast, ads and SaaS interfaces.</span>
            </label>
          </fieldset>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
            <SectionLabel>// order · {items.length} items</SectionLabel>
            <ul className="divide-y divide-[color:var(--hairline)]">
              {items.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <img src={a.img} alt="" className="h-12 w-20 object-cover" />
                  <div className="flex-1 text-sm">
                    <div>{a.title}</div>
                    <div className="font-mono text-[10px] text-[color:var(--mute)]">{a.kind} · {a.creator}</div>
                  </div>
                  <div className="font-mono text-sm">${a.price.toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-[color:var(--hairline)] pt-4 font-mono text-sm">
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Subtotal</dt><dd>${total.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Tax (est.)</dt><dd>${(total*0.08).toFixed(2)}</dd></div>
              <div className="flex justify-between border-t border-[color:var(--hairline)] pt-2 text-base">
                <dt>Total</dt><dd className="text-[color:var(--amber)]">${(total*1.08).toFixed(2)}</dd>
              </div>
            </dl>
            <button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] hover:-translate-y-0.5 transition-transform">
              Place order <span>→</span>
            </button>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              Instant download after payment. Refunds within 14 days.
            </div>
          </div>
        </aside>
      </form>
    </Shell>
  );
}
