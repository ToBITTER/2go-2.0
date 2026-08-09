import { CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import { roadmapPhases } from "@/data/roadmap";

export function Roadmap() {
  return (
    <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#8fb7d5]">What&apos;s inside</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Built for people, rooms, and real-time chat</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1720] px-3 py-1 text-sm text-[#dbe6ee]">
          <Sparkles className="h-4 w-4" />
          No filler
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {roadmapPhases.map((phase, index) => (
          <article key={phase.title} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-5">
            <div className="flex items-start gap-3">
              {phase.status === "done" ? (
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300" />
              ) : (
                <CircleDashed className="mt-1 h-5 w-5 text-[#8fb7d5]" />
              )}
              <div>
                <h3 className="font-semibold text-white">{phase.title}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-[#b9c6d3]">
                  {phase.status === "done" ? "Done" : phase.status === "in-progress" ? "Live" : "Soon"}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#b9c6d3]">{phase.summary}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {phase.items.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-[#13202b] px-3 py-1 text-xs text-[#dbe6ee]">
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
