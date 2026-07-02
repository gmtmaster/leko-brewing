import { philosophy } from "./landingData";

export function LandingPhilosophy() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-[#172018] px-5 py-24 text-[#fffaf0] sm:px-8 lg:px-14 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(134,239,172,0.16),transparent_32rem),radial-gradient(ellipse_at_82%_80%,rgba(56,189,248,0.13),transparent_30rem)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="section-reveal">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#86efac]/70">
            Brewing philosophy
          </p>
          <h2 className="mt-6 max-w-xl font-serif text-[clamp(3rem,7vw,7rem)] font-black leading-[0.82] tracking-[-0.04em]">
            Small decisions you can taste.
          </h2>
        </div>

        <div className="grid gap-4">
          {philosophy.map((item) => (
            <article
              key={item.label}
              className="section-reveal group grid gap-5 border-t border-[#fffaf0]/12 py-7 transition duration-300 hover:border-[#86efac]/42 sm:grid-cols-[9rem_1fr]"
            >
              <p className="text-[0.66rem] font-black uppercase tracking-[0.24em] text-[#fffaf0]/38">
                {item.label}
              </p>
              <div>
                <h3 className="font-serif text-3xl font-black tracking-[-0.03em] text-[#fffaf0]">
                  {item.value}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[#fffaf0]/58">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
