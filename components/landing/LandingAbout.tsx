import { BonsaiMotif } from "@/components/BonsaiMotif";
import Image from "next/image";

export function LandingAbout() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#fffaf0] px-5 py-24 text-[#172018] sm:px-8 lg:px-14 lg:py-32"
    >
      <Image
        src="/textures/bonsai-bg.png"
        alt=""
        fill={false}
        width={900}
        height={900}
        priority={false}
        className="pointer-events-none absolute right-[-8rem] top-0 h-auto w-[42rem] select-none opacity-[0.045] object-contain sm:right-[-4rem] lg:right-[3vw]"
      />

      <div className="section-reveal relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#315844]/62">
            About LEKO
          </p>
          <h2 className="mt-6 max-w-lg font-serif text-[clamp(3rem,8vw,7.5rem)] font-black leading-[0.82] tracking-[-0.04em]">
            Built quiet. Served bright.
          </h2>
        </div>

        <div className="grid gap-7 text-[#172018]/68 sm:grid-cols-2">
          <p className="text-lg leading-8">
            We brew for clarity: beers with enough character to be remembered, enough balance to order again, and enough design care to feel good in your hand.
          </p>
          <div className="rounded-[2rem] border border-[#172018]/8 bg-[#fbf4e8] p-6 shadow-[0_24px_80px_rgba(38,31,21,0.06)]">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.24em] text-[#315844]/62">
              What guides us
            </p>
            <p className="mt-4 text-base leading-7">
              Fresh releases, exact labels, no unnecessary noise. The result should feel natural before it feels clever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
