"use client";

import { LenisProvider } from "../components/LenisProvider";
import { LandingAnimations } from "../components/landing/LandingAnimations";
import { LandingNavbar } from "../components/landing/LandingNavbar";
import { LandingHero } from "../components/landing/LandingHero";
import { LandingAbout } from "../components/landing/LandingAbout";
import { BeerLineup } from "../components/landing/BeerLineup";
import { LandingPhilosophy } from "../components/landing/LandingPhilosophy";
import { FinalCTA } from "../components/landing/FinalCTA";
import { LandingFooter } from "../components/landing/LandingFooter";

export default function Home() {
  return (
    <LenisProvider>
      <main className="landing-root min-h-screen overflow-x-hidden bg-[#fffaf0] text-[#172018]">
        <LandingAnimations />

        <LandingNavbar />
        <LandingHero />
        <LandingAbout />
        <BeerLineup />
        <LandingPhilosophy />
        <FinalCTA />
        <LandingFooter />
      </main>
    </LenisProvider>
  );
}
