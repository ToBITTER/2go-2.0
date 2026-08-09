import { AppShell } from "@/components/layout/app-shell";
import { SectionHeading } from "@/components/section-heading";
import { getProfile } from "@/lib/api";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  try {
    const payload = await getProfile(username);

    return (
      <AppShell title={payload.user.displayName} subtitle={`@${payload.user.username}`}>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Public profile"
            title={payload.user.displayName}
            description="A real public profile surfaced from the API."
          />
          <section className="rounded-[20px] border border-white/10 bg-[#13202b] p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-[#8fb7d5]">@{payload.user.username}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{payload.user.rank}</p>
            <p className="mt-4 text-sm leading-6 text-[#b9c6d3]">{payload.user.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {payload.user.interests.map((interest) => (
                <span key={interest} className="rounded-full border border-white/10 bg-[#0d1720] px-3 py-1 text-sm text-[#dbe6ee]">
                  {interest}
                </span>
              ))}
            </div>
          </section>
        </div>
      </AppShell>
    );
  } catch {
    notFound();
  }
}
