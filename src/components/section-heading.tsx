type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>
    </div>
  );
}
