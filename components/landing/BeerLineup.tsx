"use client";

import { beers } from "./landingData";
import { BeerCard } from "./BeerCard";

export function BeerLineup() {
  return (
    <section
      id="lineup"
      className="relative overflow-hidden bg-[#fbf4e8] px-5 py-24 text-[#172018] sm:px-8 lg:px-14 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#172018]/8" />
      <div className="pointer-events-none absolute left-[-8rem] top-36 h-[24rem] w-[24rem] rounded-full bg-[#38bdf8]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] bottom-20 h-[28rem] w-[28rem] rounded-full bg-[#f6c76f]/18 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="section-reveal mb-14 grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="mb-5 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#315844]/62">
              Featured beers
            </p>
            <h2 className="max-w-4xl font-serif text-[clamp(3.3rem,8vw,8rem)] font-black leading-[0.8] tracking-[-0.045em]">
              Four labels. One point of view.
            </h2>
          </div>
          <p className="max-w-md text-lg leading-8 text-[#172018]/62">
            A compact release family: bright hops, soft wheat, clean spice, and crisp bitterness with every label ready to swap from the data file.
          </p>
        </div>

        <div className="beer-grid grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {beers.map((beer, index) => (
            <BeerCard key={beer.name} beer={beer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
