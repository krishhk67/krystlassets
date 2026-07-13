import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shell, PageHeader } from "@/components/site";
import { getMyCart, removeFromCart } from "@/lib/user.functions";
import { resolveImg } from "@/lib/img";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: CartPage,
});

function CartPage() {
  const { isAuthed, loading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: () => getMyCart(),
    enabled: isAuthed,
  });

  const remove = useMutation({
    mutationFn: (asset_id: string) => removeFromCart({ data: { asset_id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
  });

  if (!sessionLoading && !isAuthed) {
    return (
      <Shell>
        <PageHeader eyebrow="// checkout · your cart" title={<>Sign in to see your cart.</>} />
        <div className="mx-auto max-w-[900px] px-6 pb-24 text-center">
          <p className="text-[color:var(--foreground)]/80">
            Your cart follows you across devices once you're in.
          </p>
          <button onClick={() => navigate({ to: "/auth" })} className="mt-6 inline-block bg-[color:var(--amber)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--ink)]">
            Sign in →
          </button>
        </div>
      </Shell>
    );
  }

  const lines = cart.data ?? [];
  const subtotal = lines.reduce((s, l) => s + l.asset.price * l.qty, 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + tax;

  return (
    <Shell>
      <PageHeader eyebrow="// checkout · your cart" title={<>Ready to <em className="not-italic text-[color:var(--amber)]">roll</em>.</>} />
      <div className="mx-auto grid max-w-[1400px] gap-10 px-6 pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {cart.isLoading ? (
            <div className="p-8 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">Loading cart...</div>
          ) : lines.length === 0 ? (
            <div className="border border-dashed border-[color:var(--hairline)] p-16 text-center">
              <div className="font-display text-2xl">Cart's empty.</div>
              <Link to="/marketplace" className="mt-6 inline-block border border-[color:var(--cyan)] px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--cyan)]">Browse marketplace</Link>
            </div>
          ) : (
            <ul className="border border-[color:var(--hairline)] divide-y divide-[color:var(--hairline)]">
              {lines.map((l) => {
                const a = l.asset;
                return (
                  <li key={l.id} className="flex gap-4 p-4">
                    <img src={resolveImg(a.img_key)} alt="" className="h-20 w-32 object-cover" />
                    <div className="flex-1">
                      <Link to="/asset/$slug" params={{ slug: a.slug }} className="font-display text-lg hair-link">{a.title}</Link>
                      <div className="mt-1 font-mono text-[11px] text-[color:var(--mute)]">by {a.creator} · {a.kind} · {a.size}</div>
                      <div className="mt-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
                        <button
                          onClick={() => remove.mutate(a.id)}
                          disabled={remove.isPending}
                          className="hair-link text-[color:var(--magenta)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">${(a.price * l.qty).toFixed(2)}</div>
                      {a.original_price && <div className="font-mono text-[10px] text-[color:var(--mute)] line-through">${a.original_price}</div>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--mute)]">// order summary</div>
            <dl className="space-y-2 font-mono text-sm">
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-[color:var(--mute)]">Tax (est.)</dt><dd>${tax.toFixed(2)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-[color:var(--hairline)] pt-3 text-base">
                <dt>Total</dt><dd className="text-[color:var(--amber)]">${total.toFixed(2)}</dd>
              </div>
            </dl>
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
