export default function Loading() {
  return (
    <main className="min-h-screen bg-radial-fog px-4 py-6 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl animate-pulse flex-col gap-6">
        <div className="h-16 rounded-[2rem] border border-white/10 bg-white/5" />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="h-[420px] rounded-[2rem] border border-white/10 bg-white/5" />
          <div className="h-[420px] rounded-[2rem] border border-white/10 bg-white/5" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-[320px] rounded-[2rem] border border-white/10 bg-white/5" />
          <div className="h-[320px] rounded-[2rem] border border-white/10 bg-white/5" />
        </div>
      </div>
    </main>
  );
}
