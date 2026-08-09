import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: string;
};

export function StatCard({ icon: Icon, label, value, accent = "text-cyan-300" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-olive-700/50 bg-black/20 p-4">
      <Icon className={`h-5 w-5 ${accent}`} />
      <p className="mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-paper-muted">{label}</p>
    </div>
  );
}

type PillProps = {
  children: React.ReactNode;
  tone?: "default" | "soft";
};

export function Pill({ children, tone = "default" }: PillProps) {
  const styles =
    tone === "soft"
      ? "border-olive-700/50 bg-paper/5 text-paper"
      : "border-amber-300/20 bg-amber-300/10 text-amber-100";

  return <span className={`rounded-full border px-3 py-1 ${styles}`}>{children}</span>;
}

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionLabel = "Say something" }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-[2rem] border border-dashed border-olive-700/50 bg-black/20 px-6 py-14 text-center">
      <div className="max-w-sm">
        <p className="text-2xl font-semibold">{title}</p>
        <p className="mt-3 text-sm leading-6 text-paper-muted">{description}</p>
        <button className="mt-6 rounded-full bg-amber-300 px-4 py-2 text-sm font-medium text-stone-950">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
