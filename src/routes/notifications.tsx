import { createFileRoute } from "@tanstack/react-router";
import { Shell, PageHeader } from "@/components/site";
import { notifications } from "@/lib/mock";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Krystlassets" }, { name: "robots", content: "noindex" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <Shell>
      <PageHeader eyebrow="// account · notifications" title={<>Everything that happened while you were cutting.</>} />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-6 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-[color:var(--mute)]">
          <span>{notifications.filter(n => n.unread).length} unread</span>
          <button className="hair-link">Mark all read</button>
        </div>
        <ul className="border border-[color:var(--hairline)] divide-y divide-[color:var(--hairline)]">
          {notifications.map((n) => (
            <li key={n.id} className={"flex items-start gap-3 p-5 " + (n.unread ? "bg-[color:var(--surface)]/60" : "")}>
              <span className="mt-1.5 h-2 w-2 rounded-full" style={{ background: `var(--${n.tint})` }} />
              <div className="flex-1">
                <div className="text-sm">{n.title}</div>
                <div className="font-mono text-[11px] text-[color:var(--mute)]">{n.body}</div>
              </div>
              <span className="font-mono text-[10px] text-[color:var(--mute)]">{n.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
