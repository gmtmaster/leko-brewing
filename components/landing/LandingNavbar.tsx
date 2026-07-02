"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function LandingNavbar() {
  const logoSources = ["/textures/logo.png", "/images/logo.png"];
  const [logoIndex, setLogoIndex] = useState(0);
  const logoSrc = logoSources[logoIndex];
  const logoFailed = logoIndex >= logoSources.length;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-[#1f2c24]/10 bg-[#fffaf0]/78 px-4 text-[#172018] shadow-[0_18px_60px_rgba(38,31,21,0.08)] backdrop-blur-xl sm:px-5">
        <a href="#" className="group flex items-center gap-3" aria-label="LEKO Brewing home">
          {!logoFailed && (
            <img
              src={logoSrc}
              alt="LEKO Brewing Co."
              className="flex h-20 w-auto object-contain"
              onError={() => setLogoIndex((current) => current + 1)}
            />
          )}
          {logoFailed && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172018] text-[0.68rem] font-black text-[#fffaf0]">
              LB
            </span>
          )}
          
        </a>

        <div className="hidden items-center gap-7 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#172018]/58 md:flex">
          <a className="transition hover:text-[#172018]" href="#about">
            Story
          </a>
          <a className="transition hover:text-[#172018]" href="#lineup">
            Beers
          </a>
          <a className="transition hover:text-[#172018]" href="#process">
            Process
          </a>
        </div>

        <a
          href="mailto:hello@lekobrewing.example"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#172018] px-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#fffaf0] transition duration-300 hover:-translate-y-0.5 hover:bg-[#315844]"
        >
          Contact <ArrowUpRight size={14} />
        </a>
      </div>
    </nav>
  );
}
