import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, PageHeader } from "@/components/site";
import { assets } from "@/lib/mock";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const [lines, setLines] = useState(assets.slice(0, 2).map(a => ({ ...a, qty: 1 })));
  const subtotal = lines.reduce((s, a) => s + a.price * a.qty, 0);
  const discount = 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + tax - discount;

  return (
    <Shell>
      <PageHeader eyebrow="// checkout · your cart" title={<>Ready to <em className="not-italic text-[color:var(--amber)]">roll</em>.</>} />
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {lines.length === 0 ? (
            <div className="border border-dashed border-[color:var(--hairline)] p-16 text-center">
              <div className="font-display text-2xl">Cart's empty.</div>
              <Link to="/marketplace" className="mt-6 inline-block border border-[color:var(--cyan)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">Browse marketplace</Link>
            </div>
          ) : (
            <ul className="border border-[color:var(--hairline)] divide-y divide-[color:var(--hairline)]">
              {lines.map((a) => (
                <li key={a.id} className="flex gap-4 p-4">
                  <img src={a.img} alt="" className="h-20 w-32 object-cover" />
                  <div className="flex-1">
                    <Link to="/asset/$slug" params={{ slug: a.slug }} className="font-display text-lg hair-link">{a.title}</Link>
                    <div className="mt-1 font-mono text-[11px] text-[color:var(--mute)]">by {a.creator} · {a.kind} · {a.size}</div>
                    <div className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
                      <button className="hair-link">Save for later</button>
                      <button onClick={() => setLines(lines.filter(x => x.id !== a.id))} className="hair-link text-[color:var(--magenta)]">Remove</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">${(a.price * a.qty).toFixed(2)}</div>
                    {a.originalPrice && <div className="font-mono text-[10px] text-[color:var(--mute)] line-through">${a.originalPrice}</div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// order summary</div>
            <dl className="space-y-2 font-mono text-sm">
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Discount</dt><dd>−${discount.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Tax (est.)</dt><dd>${tax.toFixed(2)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-[color:var(--hairline)] pt-3 text-base">
                <dt>Total</dt><dd className="text-[color:var(--amber)]">${total.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-2">
              <input placeholder="Coupon code" className="flex-1 border border-[color:var(--hairline)] bg-transparent px-3 py-2 font-mono text-[11px] uppercase tracking-widest placeholder:text-[color:var(--mute)] focus:border-[color:var(--cyan)] outline-none" />
              <button className="border border-[color:var(--hairline)] px-3 py-2 font-mono text-[10px] uppercase tracking-widest hover:border-[color:var(--cyan)]">Apply</button>
            </div>
            <Link to="/checkout" className="mt-6 flex items-center justify-center gap-2 bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)] hover:-translate-y-0.5 transition-transform">
              Checkout <span>→</span>
            </Link>
            <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
              Regional pricing applied. Prices shown in USD.
            </div>
          </div>
        </aside>
      </div>
    </Shell>
  );
}
