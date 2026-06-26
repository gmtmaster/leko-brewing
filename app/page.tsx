"use client";

import dynamic from "next/dynamic";
import { ArrowRight, Leaf, Sparkles, Trees, Waves } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisProvider } from "@/components/LenisProvider";
import { BonsaiMotif } from "@/components/BonsaiMotif";
import { useEffect } from "react";

const BeerCanScene = dynamic(
  () => import("@/components/BeerCanScene").then((module) => module.BeerCanScene),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

const split = (text: string) =>
  text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`} className="inline-block overflow-hidden align-top">
      <span className="split-word mr-[0.18em]">{word}</span>
    </span>
  ));

const ingredients = [
  { name: "Soft Water", note: "a quiet mineral base that lets hops and malt breathe" },
  { name: "Selected Hops", note: "layered aroma chosen for elegance rather than volume" },
  { name: "Patient Ferments", note: "clean profiles, natural texture, and time in tank" },
  { name: "Precise Grain", note: "pilsner malt, oats, wheat, and specialty lots used with restraint" }
];

const beers = [
  ["Daylight Haze", "Hazy IPA", "6.7%", "pink guava, orange blossom, soft pine"],
  ["Helles Morning", "Helles Lager", "4.9%", "biscuit, meadow grass, clear morning malt"],
  ["Luna Blanca", "Witbier", "5.1%", "white citrus, coriander, soft wheat"],
  ["West Coast IPA", "Modern IPA", "6.8%", "grapefruit peel, pine resin, dry finish"]
];

export default function Home() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".split-word", {
        y: 0,
        duration: 1.35,
        ease: "power4.out",
        stagger: 0.045,
        delay: 0.25
      });

      gsap.to(".hero-copy", {
        y: -62,
        opacity: 0.58,
        scrollTrigger: {
          trigger: ".hero-pin",
          start: "top top",
          end: "bottom top",
          scrub: 1.1
        }
      });

      gsap.utils.toArray<HTMLElement>(".section-reveal").forEach((section) => {
        gsap.to(section, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%"
          }
        });
      });

      gsap.to(".bonsai-line", {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".philosophy",
          start: "top 70%",
          end: "bottom 54%",
          scrub: 1
        }
      });

      gsap.to(".parallax-haze", {
        yPercent: -16,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing-root",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <LenisProvider>
      <main className="landing-root cinematic-grain min-h-screen overflow-hidden bg-ink text-cream">
        <section className="hero-pin relative isolate flex min-h-screen items-center overflow-hidden ambient-orchard px-5 py-6 sm:px-8 lg:px-12">
          <div className="parallax-haze pointer-events-none absolute inset-0 -z-10 opacity-90">
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-rosehaze/16 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-nectar/18 via-transparent to-transparent" />
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-moss/12 to-transparent" />
          </div>

          <nav className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 text-[0.68rem] uppercase tracking-[0.32em] text-cream/72 sm:px-8 lg:px-12">
            <span>LEKO Brewing Co.</span>
            <span className="hidden sm:block">Hungary / Small Batch / Nature-Led</span>
          </nav>

          <div className="absolute inset-0 z-0">
            <BeerCanScene />
          </div>

          <div className="hero-copy pointer-events-none relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.45fr)]">
            <div className="min-w-0 max-w-5xl">
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.42em] text-nectar/80">
                Small-batch beer brewed with patience, nature and obsession.
              </p>
              <h1 className="max-w-4xl font-display text-[12.8vw] font-semibold uppercase leading-[0.82] tracking-normal text-cream drop-shadow-[0_24px_65px_rgba(22,15,22,0.45)] sm:text-[11vw] lg:text-[7.45rem]">
                {split("LEKO BREWING CO.")}
              </h1>
            </div>

            <div className="pointer-events-auto min-w-0 max-w-md pb-8 lg:ml-auto lg:pb-14">
              <p className="text-balance text-base leading-7 text-cream/78 sm:text-lg">
                Small-batch beer from Hungary. Calm, expressive cans shaped by soft water,
                careful fermentation, and a bonsai-like obsession with what to leave out.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lineup"
                  className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-cream px-6 text-sm font-semibold text-ink shadow-glow transition hover:bg-white"
                >
                  Explore the Brewery <ArrowRight size={17} />
                </a>
                <a
                  href="#beer"
                  className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-cream/25 bg-cream/8 px-6 text-sm font-semibold text-cream backdrop-blur-md transition hover:border-cream/55 hover:bg-cream/12"
                >
                  View Lineup
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 h-14 w-px -translate-x-1/2 overflow-hidden bg-cream/16">
            <span className="block h-1/2 w-full animate-[pulse_1.8s_ease-in-out_infinite] bg-nectar" />
          </div>
        </section>

        <section id="beer" className="relative bg-cream px-5 py-24 text-ink sm:px-8 lg:px-12 lg:py-36">
          <div className="section-reveal mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1fr]">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-moss">The Brewery</p>
              <h2 className="font-display text-5xl font-semibold leading-none text-mulberry sm:text-7xl">
                Brewing as a slow practice.
              </h2>
            </div>
            <div className="max-w-2xl text-lg leading-8 text-ink/70">
              LEKO Brewing Co. makes modern beer with a restrained hand: clean lagers,
              soft hazy ales, precise wheat beers, and hop-forward releases built around
              balance. The work is patient, natural, and obsessive in the details.
            </div>
          </div>

          <div className="section-reveal mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-3">
            {[
              ["500ml", "Tall Cans"],
              ["Small", "Batch Size"],
              ["Hungary", "Brewed In"]
            ].map(([value, label]) => (
              <div key={label} className="border-t border-ink/15 py-7">
                <div className="font-display text-5xl font-semibold text-mulberry">{value}</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[0.26em] text-ink/45">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#f3dca7] px-5 py-24 text-ink sm:px-8 lg:px-12 lg:py-32">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream to-transparent" />
          <div className="section-reveal mx-auto max-w-7xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-pine/70">Ingredients</p>
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr]">
              <h2 className="font-display text-5xl font-semibold leading-none text-pine sm:text-7xl">
                Natural inputs, carefully edited.
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {ingredients.map((item, index) => (
                  <article
                    key={item.name}
                    className="min-h-44 border border-pine/15 bg-cream/36 p-6 shadow-[0_18px_60px_rgba(86,59,28,0.08)] backdrop-blur"
                  >
                    <div className="mb-7 flex h-10 w-10 items-center justify-center rounded-full bg-pine text-cream">
                      {[<Leaf key="leaf" />, <Sparkles key="sparkles" />, <Waves key="waves" />, <Trees key="trees" />][index]}
                    </div>
                    <h3 className="font-display text-3xl font-semibold text-pine">{item.name}</h3>
                    <p className="mt-3 leading-7 text-ink/63">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="philosophy relative overflow-hidden bg-pine px-5 py-24 text-cream sm:px-8 lg:px-12 lg:py-36">
          <BonsaiMotif className="pointer-events-none absolute -right-24 top-10 h-[24rem] w-[42rem] text-nectar/23 sm:h-[32rem]" />
          <div className="section-reveal relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-nectar/80">
                Brewing Philosophy
              </p>
              <h2 className="font-display text-5xl font-semibold leading-none sm:text-7xl">
                Nature, edited with patience.
              </h2>
            </div>
            <div className="grid gap-8 text-lg leading-8 text-cream/72">
              <p>
                LEKO beers are designed around quiet detail: soft water, expressive but
                balanced hops, and fermentation profiles that feel alive without taking
                over the room.
              </p>
              <p>
                The bonsai motif is our reminder to remove what is unnecessary. Every
                batch should feel shaped, calm, and full of daylight.
              </p>
            </div>
          </div>
        </section>

        <section id="lineup" className="bg-[#f9efd2] px-5 py-24 text-ink sm:px-8 lg:px-12 lg:py-36">
          <div className="section-reveal mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-moss">Beer Lineup</p>
                <h2 className="font-display text-5xl font-semibold leading-none text-mulberry sm:text-7xl">
                  Four ways into the trees.
                </h2>
              </div>
              <p className="max-w-md leading-7 text-ink/60">
                A calm release family built around haze, clarity, shade, and sun.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {beers.map(([name, style, abv, note]) => (
                <article
                  key={name}
                  className="group min-h-80 overflow-hidden border border-ink/10 bg-white/42 p-6 shadow-[0_20px_70px_rgba(70,48,30,0.08)] transition duration-500 hover:-translate-y-2 hover:bg-white/65"
                >
                  <div className="mb-10 h-28 border border-ink/10 bg-[linear-gradient(135deg,rgba(217,154,163,0.58),rgba(246,199,111,0.64)_48%,rgba(111,139,90,0.48))] shadow-inner transition duration-500 group-hover:brightness-110" />
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="font-display text-4xl font-semibold leading-none text-pine">{name}</h3>
                    <span className="text-sm font-bold text-mulberry">{abv}</span>
                  </div>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-ink/42">{style}</p>
                  <p className="mt-8 leading-7 text-ink/62">{note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-ink px-5 py-24 text-cream sm:px-8 lg:px-12 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(217,154,163,0.24),transparent_28rem),radial-gradient(circle_at_70%_80%,rgba(246,199,111,0.18),transparent_24rem)]" />
          <div className="section-reveal relative mx-auto flex min-h-[56vh] max-w-5xl flex-col items-center justify-center text-center">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-nectar/80">LEKO Brewing Co.</p>
            <h2 className="font-display text-6xl font-semibold leading-[0.9] sm:text-8xl">
              Beer with room to breathe.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-cream/70">
              A cinematic, nature-led brewing identity for cans that feel considered from
              first glance to last sip.
            </p>
            <a
              href="mailto:hello@lekobrewing.example"
              className="mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-nectar px-7 text-sm font-bold text-ink shadow-glow transition hover:bg-cream"
            >
              Contact the Brewery <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </main>
    </LenisProvider>
  );
}
