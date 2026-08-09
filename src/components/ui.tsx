import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  accent?: string;
};

export function StatCard({ icon: Icon, label, value, accent = "text-cyan-300" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <Icon className={`h-5 w-5 ${accent}`} />
      <p className="mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
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
      ? "border-white/10 bg-white/5 text-slate-200"
      : "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";

  return <span className={`rounded-full border px-3 py-1 ${styles}`}>{children}</span>;
}

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionLabel = "Say something" }: EmptyStateProps) {
  return (
    <div className="grid place-items-center rounded-[2rem] border border-dashed border-white/15 bg-white/5 px-6 py-14 text-center">
      <div className="max-w-sm">
        <p className="text-2xl font-semibold">{title}</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
        <button className="mt-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
