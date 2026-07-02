"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Instagram } from "lucide-react";
import { beers } from "./landingData";

const ProductCanCanvas = dynamic(
  () => import("@/components/ProductCanCanvas").then((m) => m.ProductCanCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  }
);

export function FinalCTA() {
  const beer = beers[1];

  return (
    <section className="final-cta relative overflow-hidden bg-[#fffaf0] px-5 py-24 text-[#172018] sm:px-8 lg:px-14 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#172018]/8" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 rounded-[2.4rem] border border-[#172018]/10 bg-[#fbf4e8] p-6 shadow-[0_30px_120px_rgba(38,31,21,0.08)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
        <div className="final-can-frame order-2 mx-auto h-[28rem] w-full max-w-[24rem] lg:order-1">
          <ProductCanCanvas
            labelSrc={beer.labelSrc}
            cameraZ={6.25}
            fov={27}
            scale={0.86}
            position={[0, -0.42, 0]}
            rotation={[0.03, Math.PI * 0.86, 0]}
            idleSpeed={0.08}
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="cta-reveal mb-5 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#315844]/62">
            Pour the next batch
          </p>
          <h2 className="cta-reveal max-w-3xl font-serif text-[clamp(3.2rem,8vw,8rem)] font-black leading-[0.78] tracking-[-0.045em]">
            Find us where the table gets interesting.
          </h2>
          <p className="cta-reveal mt-7 max-w-xl text-lg leading-8 text-[#172018]/62">
            For collaborations, taproom drops, label experiments, and small-batch releases, send a note. We keep the inbox as clean as the finish.
          </p>
          <div className="cta-reveal mt-9 flex flex-wrap gap-3">
            <a
              href="mailto:hello@lekobrewing.example"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#172018] px-6 text-sm font-bold text-[#fffaf0] shadow-[0_18px_45px_rgba(23,32,24,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#315844]"
            >
              Start a conversation <ArrowRight size={16} />
            </a>
            <a
              href="https://instagram.com/lekobrewco"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#172018]/12 bg-white/50 px-6 text-sm font-bold text-[#172018] transition duration-300 hover:-translate-y-0.5 hover:border-[#172018]/28"
            >
              <Instagram size={16} /> Follow
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
