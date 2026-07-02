"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Beer } from "./landingData";

const ProductCanCanvas = dynamic(
  () => import("@/components/ProductCanCanvas").then((m) => m.ProductCanCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  }
);

export function BeerCard({ beer, index }: { beer: Beer; index: number }) {
  const { name, style, abv, note, detail, accent, labelSrc } = beer;

  return (
    <article
      className="beer-card tilt-card group relative flex min-h-[34rem] flex-col overflow-hidden rounded-[2rem] border border-[#172018]/10 bg-[#fffaf0] shadow-[0_24px_80px_rgba(38,31,21,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_34px_110px_rgba(38,31,21,0.12)]"
      style={{ "--beer-accent": accent } as CSSProperties}
    >
      <div className="absolute right-5 top-5 z-10 flex h-10 items-center rounded-full border border-[#172018]/10 bg-white/72 px-3 text-[0.64rem] font-black uppercase tracking-[0.18em] text-[#172018]/62 backdrop-blur">
        {abv}
      </div>

      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(circle at 50% 16%, ${accent}38, transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.84), rgba(251,244,232,0.36))`,
          }}
        />
        <div className="absolute left-6 top-6 rounded-full bg-[#172018] px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.22em] text-[#fffaf0]">
          0{index + 1}
        </div>
        <div className="absolute inset-x-8 bottom-3 h-8 rounded-full bg-[#172018]/12 blur-xl" />
        <div className="relative mx-auto h-80 w-52 transition duration-700 ease-out group-hover:-translate-y-3 group-hover:scale-[1.03]">
          <ProductCanCanvas
            labelSrc={labelSrc}
            cameraZ={6.1}
            cameraY={0.62}
            fov={25}
            scale={0.76}
            position={[0, -0.42, 0]}
            rotation={[0.02, Math.PI * 0.94, 0]}
            idleSpeed={0.1}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-[#172018]/42">
            {style}
          </p>
          <h3 className="mt-3 font-serif text-[2.25rem] font-black leading-[0.92] tracking-[-0.03em] text-[#172018]">
            {name}
          </h3>
          <p className="mt-4 text-sm font-bold leading-6 text-[#172018]/54">
            {note}
          </p>
          <p className="mt-4 text-sm leading-6 text-[#172018]/62">
            {detail}
          </p>
        </div>

        <div className="mt-7 flex items-center justify-between border-t border-[#172018]/8 pt-5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          <span className="inline-flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#172018]/48 transition group-hover:text-[#172018]">
            Label detail <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
