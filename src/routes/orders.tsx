import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader, Chip } from "@/components/site";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

const orders = [
  { id: "A-1029", date: "12 Jan 2026", items: 2, total: 62.00, status: "Paid" },
  { id: "A-0987", date: "03 Jan 2026", items: 1, total: 28.00, status: "Paid" },
  { id: "A-0921", date: "18 Dec 2025", items: 4, total: 118.50, status: "Refunded" },
  { id: "A-0844", date: "02 Dec 2025", items: 1, total: 14.00, status: "Paid" },
];

function OrdersPage() {
  return (
    <Shell>
      <PageHeader eyebrow="// account · orders" title={<>Every receipt, every download.</>} />
      <div className="mx-auto max-w-[1400px] px-6 pb-24">
        <div className="border border-[color:var(--hairline)]">
          <div className="grid grid-cols-6 gap-4 border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/50 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--mute)]">
            <span>Order</span><span>Date</span><span>Items</span><span>Total</span><span>Status</span><span></span>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="grid grid-cols-6 items-center gap-4 border-b border-[color:var(--hairline)] px-5 py-4 last:border-b-0 text-sm">
              <span className="font-mono">#{o.id}</span>
              <span className="font-mono text-[color:var(--mute)]">{o.date}</span>
              <span>{o.items}</span>
              <span className="font-mono">${o.total.toFixed(2)}</span>
              <span><Chip tint={o.status === "Paid" ? "cyan" : "magenta"}>{o.status}</Chip></span>
              <span className="flex gap-2 justify-end">
                <Link to="/library" className="hair-link text-[color:var(--mute)]">Downloads</Link>
                <button className="hair-link text-[color:var(--mute)]">Invoice</button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
