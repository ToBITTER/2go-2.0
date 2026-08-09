import { CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import { roadmapPhases } from "@/data/roadmap";

export function Roadmap() {
  return (
    <section className="rounded-[2rem] border border-olive-700/60 bg-panel p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Build order</p>
          <h2 className="mt-2 text-2xl font-semibold">How we will ship 2go 2.0</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-sm text-amber-100">
          <Sparkles className="h-4 w-4" />
          Nothing gets skipped
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {roadmapPhases.map((phase, index) => (
          <article key={phase.title} className="rounded-3xl border border-olive-700/50 bg-black/20 p-5">
            <div className="flex items-start gap-3">
              {phase.status === "done" ? (
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" />
              ) : (
                <CircleDashed className="mt-1 h-5 w-5 text-amber-200" />
              )}
              <div>
                <h3 className="font-semibold">{phase.title}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-paper-muted">
                  {phase.status === "done" ? "Complete" : phase.status === "in-progress" ? "In progress" : "Upcoming"}
                </p>
                <p className="mt-1 text-sm leading-6 text-paper-muted">{phase.summary}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {phase.items.map((item) => (
                <span key={item} className="rounded-full border border-olive-700/50 bg-paper/5 px-3 py-1 text-xs text-paper">
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
