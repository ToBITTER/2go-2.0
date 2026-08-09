import { ArrowRight, MessageSquareText, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

export default function Page() {
  return (
    <AppShell title="Home" subtitle="Who's around?" actionLabel="Sign up" actionHref="/auth/sign-up">
      <section className="flex min-h-[calc(100vh-2rem)] flex-col justify-center gap-8 pb-16 pt-8">
        <div className="mx-auto w-full max-w-4xl rounded-[24px] border border-white/10 bg-[#13202b] p-6 shadow-soft md:p-10">
          <p className="text-[11px] uppercase tracking-[0.45em] text-[#8fb7d5]">2go 2.0</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Remember when chat felt alive?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#b9c6d3] md:text-lg">
            2go brings back that simple, familiar feeling. Quick sign up, quick log in, and straight into the vibe.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-[#e7f0f7] px-6 py-3 text-sm font-semibold text-[#163042]"
            >
              Sign up
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-[#0d1720] px-6 py-3 text-sm font-semibold text-[#dbe6ee]"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-4xl gap-4 md:grid-cols-3">
          {[
            { icon: Users, title: "People online", text: "See who&apos;s around right now." },
            { icon: MessageSquareText, title: "Statuses", text: "Drop a quick thought and move." },
            { icon: ArrowRight, title: "Quick entry", text: "Sign up or log in and roll in." },
          ].map((item) => (
            <article key={item.title} className="rounded-[18px] border border-white/10 bg-[#0d1720] p-5">
              <item.icon className="h-5 w-5 text-[#8fb7d5]" />
              <h2 className="mt-4 text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#b9c6d3]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
