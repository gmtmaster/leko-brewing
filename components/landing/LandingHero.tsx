"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Sparkles } from "lucide-react";
import { featuredBeer } from "./landingData";

const ProductCanCanvas = dynamic(
  () => import("@/components/ProductCanCanvas").then((m) => m.ProductCanCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  }
);

export function LandingHero() {
  return (
    <section className="hero-pin relative isolate min-h-screen overflow-hidden bg-[#fbf4e8] px-5 pb-16 pt-28 text-[#172018] sm:px-8 lg:px-14">
      <div className="parallax-haze pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#f6c76f]/30 blur-3xl" />
        <div className="absolute right-[-14rem] top-28 h-[36rem] w-[36rem] rounded-full bg-[#38bdf8]/20 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#86efac]/18 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="hero-copy section-reveal max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#172018]/10 bg-white/58 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#315844] shadow-[0_18px_50px_rgba(34,29,19,0.06)] backdrop-blur">
            <Sparkles size={14} />
            Kis széria, nagy figyelem
          </div>

          <h1 className="max-w-5xl font-serif text-[clamp(4.5rem,15vw,10rem)] font-black uppercase leading-[0.74] tracking-[-0.04em] text-[#172018]">
            {"Beer with a pulse.".split(" ").map((word) => (
              <span key={word} className="mr-[0.16em] inline-block overflow-hidden align-top">
                <span className="split-word inline-block">{word}</span>
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#172018]/66 sm:text-xl sm:leading-9">
            LEKO Brewing Co. makes vivid, modern cans for people who care about the first sip, the last detail, and the room a beer creates.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#lineup"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#172018] px-6 text-sm font-bold text-[#fffaf0] shadow-[0_18px_45px_rgba(23,32,24,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#315844]"
            >
              Explore cans <ArrowRight size={16} />
            </a>
            <a
              href="#about"
              className="inline-flex h-12 items-center rounded-full border border-[#172018]/12 bg-white/44 px-6 text-sm font-bold text-[#172018] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#172018]/28"
            >
              Read the story
            </a>
          </div>
        </div>

        <div className="section-reveal relative mx-auto h-[32rem] w-full max-w-[42rem] sm:h-[38rem] lg:h-[44rem]">
          <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#172018]/8 bg-white/28 shadow-[inset_0_0_80px_rgba(255,255,255,0.72)]" />
          <div className="float-chip absolute left-2 top-14 rounded-full border border-[#172018]/10 bg-white/70 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#172018]/58 shadow-[0_16px_40px_rgba(39,30,18,0.08)] backdrop-blur">
            {featuredBeer.style}
          </div>
          <div className="float-chip float-chip-delay absolute bottom-20 right-0 rounded-full border border-[#172018]/10 bg-white/70 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#172018]/58 shadow-[0_16px_40px_rgba(39,30,18,0.08)] backdrop-blur">
            {featuredBeer.abv} ABV
          </div>
          <div className="absolute inset-x-0 bottom-9 mx-auto h-10 w-3/4 rounded-full bg-[#172018]/12 blur-2xl" />
          <div className="relative h-full w-full">
            <ProductCanCanvas
              labelSrc={featuredBeer.labelSrc}
              cameraZ={5.9}
              cameraY={0.54}
              fov={24}
              scale={0.7}
              position={[0, -0.25, 0]}
              rotation={[0.02, Math.PI * 0.88, 0]}
              idleSpeed={0.08}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#172018]/36 sm:flex">
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.34em]">Scroll</span>
        <div className="h-10 w-px overflow-hidden bg-[#172018]/12">
          <div className="h-1/2 w-full animate-[slideDown_2s_ease-in-out_infinite] bg-[#172018]" />
        </div>
      </div>
    </section>
  );
}
