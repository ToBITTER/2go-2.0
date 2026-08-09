import type { ReactNode } from "react";

export function AuthCard({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <section className="mx-auto w-full max-w-md rounded-[18px] border border-white/10 bg-[#121a22] p-5 shadow-soft">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8fb7d5]">2go 2.0</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#b9c6d3]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
