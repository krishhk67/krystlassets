import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/site";
import { categories } from "@/lib/mock";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — Krystlassets" }, { name: "description", content: "Browse assets by software and category." }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <Shell>
      <PageHeader
        eyebrow="// browse · categories"
        title={<>Every bin, one <em className="not-italic text-[color:var(--amber)]">click</em> away.</>}
      />
      <ul className="mx-auto grid max-w-[1400px] grid-cols-2 px-6 pb-24 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <li key={c.slug}>
            <Link
              to="/marketplace"
              className={
                "group relative flex items-center justify-between gap-3 border-[color:var(--hairline)] px-5 py-6 transition-colors hover:bg-[color:var(--surface)] " +
                "border-t border-l " +
                ((i + 1) % 2 === 0 ? "border-r sm:border-r-0 " : "") +
                ((i + 1) % 3 === 0 ? "sm:border-r " : "sm:border-r-0 ") +
                ((i + 1) % 4 === 0 ? "lg:border-r " : "lg:border-r-0 ") +
                (i >= categories.length - 2 ? "border-b " : "") +
                (i >= categories.length - 3 ? "sm:border-b " : "") +
                (i >= categories.length - 4 ? "lg:border-b " : "")
              }
            >
              <span className="font-display text-xl tracking-tight">{c.label}</span>
              <span className="font-mono text-xs text-[color:var(--mute)] group-hover:text-[color:var(--cyan)]">{c.n.toLocaleString()}</span>
              <span aria-hidden className="absolute inset-x-5 bottom-4 h-px scale-x-0 origin-left bg-[color:var(--cyan)] transition-transform duration-500 group-hover:scale-x-100" />
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
