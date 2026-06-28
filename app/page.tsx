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

const ProductCanCanvas = dynamic(
  () => import("@/components/ProductCanCanvas").then((module) => module.ProductCanCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full rounded-full bg-sky-200/5" />
  }
);

gsap.registerPlugin(ScrollTrigger);

const split = (text: string) =>
  text.split(" ").map((word, index) => (
    <span key={`${word}-${index}`} className="inline-block overflow-hidden align-top">
      <span className="split-word mr-[0.18em]">{word}</span>
    </span>
  ));

const ingredients = [
  { name: "Lágy víz", note: "tiszta alap, ami hagyja érvényesülni a komlót, a malátát és az erjedés finom részleteit" },
  { name: "Válogatott komlók", note: "rétegzett aroma, citrus, gyümölcs és fenyős frissesség — nem hangerőből, hanem egyensúlyból" },
  { name: "Türelmes erjesztés", note: "kontrollált hőmérséklet, tiszta profil és idő a tartályban, hogy a sör összeérjen" },
  { name: "Precíz gabonaalap", note: "pilseni maláta, búza, zab és kiegészítő maláták visszafogott, céltudatos használata" }
];

const beers = [
  ["Daylight Haze", "Hazy IPA", "6.5%", "trópusi gyümölcs, citrus, puha kortyérzet"],
  ["Golden Hour", "American Wheat", "4.5%", "narancs, korianderlehelet, nyári frissesség"],
  ["Luna Blanca", "Witbier", "5.1%", "fehér citrus, koriander, lágy búzás alap"],
  ["West Coast IPA", "Modern West Coast IPA", "6.8%", "grapefruit, fenyőgyanta, száraz lecsengés"]
];

export default function Home() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cardCleanups: Array<() => void> = [];
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      if (prefersReducedMotion) {
        gsap.set(
          ".section-reveal, .premium-reveal, .brewery-stat, .ingredient-card, .beer-card, .cta-reveal, .showcase-can, .transition-can, .lineup-can-shell",
          { opacity: 1, y: 0, rotateX: 0, rotateY: 0, clearProps: "transform" }
        );
        gsap.set(".bonsai-line", { strokeDashoffset: 0 });
        return;
      }

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

      gsap.utils.toArray<HTMLElement>(".premium-reveal").forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 34, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 82%"
            }
          }
        );
      });

      gsap.fromTo(
        ".brewery-stat",
        { autoAlpha: 0, y: 90, z: -140, rotateX: 12 },
        {
          autoAlpha: 1,
          y: 0,
          z: 0,
          rotateX: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".brewery-stats",
            start: "top 82%"
          }
        }
      );

      gsap.utils.toArray<HTMLElement>(".brewery-stat").forEach((stat, index) => {
        gsap.to(stat, {
          yPercent: index % 2 === 0 ? -18 : -10,
          ease: "none",
          scrollTrigger: {
            trigger: ".brewery-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      gsap.fromTo(
        ".showcase-can-left",
        { autoAlpha: 0, xPercent: -72, rotate: -12, scale: 0.78 },
        {
          autoAlpha: 1,
          xPercent: 0,
          rotate: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-showcase",
            start: "top 84%",
            end: "center 45%",
            scrub: 1.1
          }
        }
      );

      gsap.fromTo(
        ".showcase-can-right",
        { autoAlpha: 0, xPercent: 72, rotate: 12, scale: 0.78 },
        {
          autoAlpha: 1,
          xPercent: 0,
          rotate: 0,
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-showcase",
            start: "top 84%",
            end: "center 45%",
            scrub: 1.1
          }
        }
      );

      gsap.to(".showcase-can-left .product-can-stage", {
        rotate: 18,
        ease: "none",
        scrollTrigger: {
          trigger: ".product-showcase",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".showcase-can-right .product-can-stage", {
        rotate: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".product-showcase",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.fromTo(
        ".ingredient-card",
        { autoAlpha: 0, y: 70, rotateX: 10, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".ingredients-grid",
            start: "top 78%"
          }
        }
      );

      gsap.to(".ingredients-gradient", {
        xPercent: 8,
        yPercent: -8,
        rotate: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".ingredients-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      });

      gsap.fromTo(
        ".transition-can",
        { xPercent: 86, yPercent: -10, rotate: -10, scale: 0.82 },
        {
          xPercent: -86,
          yPercent: 8,
          rotate: 10,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: ".can-transition",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );

      gsap.to(".transition-can .product-can-stage", {
        rotate: 70,
        ease: "none",
        scrollTrigger: {
          trigger: ".can-transition",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.to(".bonsai-line", {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".philosophy",
          start: "top 74%",
          end: "top 28%",
          scrub: 0.8
        }
      });

      gsap.to(".philosophy-motif", {
        xPercent: -8,
        yPercent: 10,
        rotate: -3,
        ease: "none",
        scrollTrigger: {
          trigger: ".philosophy",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1
        }
      });

      gsap.to(".philosophy-copy", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: ".philosophy",
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      gsap.fromTo(
        ".beer-card",
        { autoAlpha: 0, y: 86, rotateX: 12, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: ".beer-grid",
            start: "top 78%"
          }
        }
      );

      gsap.fromTo(
        ".lineup-can-shell",
        { yPercent: 18, rotate: -5, scale: 0.92 },
        {
          yPercent: 0,
          rotate: 0,
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".beer-grid",
            start: "top 78%"
          }
        }
      );

      gsap.to(".floating-can-mark", {
        yPercent: -20,
        rotate: 12,
        ease: "none",
        scrollTrigger: {
          trigger: "#lineup",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4
        }
      });

      gsap.fromTo(
        ".cta-reveal",
        { autoAlpha: 0, y: 38, filter: "blur(12px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".final-cta",
            start: "top 72%"
          }
        }
      );

      gsap.to(".cta-glow", {
        xPercent: -9,
        yPercent: 7,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.3
        }
      });

      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const setRotateX = gsap.quickTo(card, "rotateX", { duration: 0.45, ease: "power3.out" });
        const setRotateY = gsap.quickTo(card, "rotateY", { duration: 0.45, ease: "power3.out" });
        const setY = gsap.quickTo(card, "y", { duration: 0.45, ease: "power3.out" });
        const can = card.querySelector<HTMLElement>(".lineup-can-shell");
        const setCanY = can ? gsap.quickTo(can, "yPercent", { duration: 0.5, ease: "power3.out" }) : null;
        const setCanRotate = can ? gsap.quickTo(can, "rotate", { duration: 0.5, ease: "power3.out" }) : null;

        const onMove = (event: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          setRotateX(y * -7);
          setRotateY(x * 8);
          setY(-8);
          setCanY?.(-22);
          setCanRotate?.(x * 9);
        };

        const onLeave = () => {
          setRotateX(0);
          setRotateY(0);
          setY(0);
          setCanY?.(0);
          setCanRotate?.(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
        cardCleanups.push(() => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        });
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

      return () => {
        cardCleanups.forEach((cleanup) => cleanup());
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <LenisProvider>
      <main className="landing-root cinematic-grain min-h-screen overflow-hidden bg-ink text-cream">
        <section className="hero-pin relative isolate flex min-h-screen items-center overflow-hidden bg-[#071426] px-5 py-6 sm:px-8 lg:px-12">
          <div className="parallax-haze pointer-events-none absolute inset-0 -z-10 opacity-95">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.28),transparent_32rem),radial-gradient(circle_at_72%_22%,rgba(168,85,247,0.20),transparent_30rem),radial-gradient(circle_at_50%_82%,rgba(20,184,166,0.18),transparent_34rem)]" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-sky-400/10 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-cyan-950/70 via-transparent to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-500/12 to-transparent" />
        </div>

          <nav className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-5 text-[0.68rem] uppercase tracking-[0.32em] text-cream/72 sm:px-8 lg:px-12">
            <span>LEKO Brewing Co.</span>
            <span className="hidden sm:block">Magyarország / kis széria / dobozos craft beer</span>
          </nav>

          <div className="absolute inset-0 z-0">
            <BeerCanScene />
          </div>

          <div className="hero-copy pointer-events-none relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-8 pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.45fr)]">
            <div className="min-w-0 max-w-5xl">
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.42em] text-sky-200/85">
                Kis szériás sörök türelemmel, kísérletezéssel és megszállott figyelemmel.
              </p>
              <h1 className="max-w-4xl font-display text-[12.8vw] font-semibold uppercase leading-[0.82] tracking-normal text-cream drop-shadow-[0_24px_65px_rgba(22,15,22,0.45)] sm:text-[11vw] lg:text-[7.45rem]">
                {split("LEKO BREWING CO.")}
              </h1>
            </div>

            <div className="pointer-events-auto min-w-0 max-w-md pb-8 lg:ml-auto lg:pb-14">
              <p className="text-balance text-base leading-7 text-cream/78 sm:text-lg">
                Kis szériás dobozos sör Magyarországról. Modern IPA-k, búzás sörök és tiszta lagerek — lágy vízzel, kontrollált erjesztéssel és azzal a mániával, hogy csak az maradjon benne, ami tényleg kell.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lineup"
                  className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-sky-100 px-6 text-sm font-semibold text-slate-950 shadow-[0_18px_55px_rgba(56,189,248,0.25)] transition hover:bg-white"
                >
                  Fedezd fel a söröket <ArrowRight size={17} />
                </a>
                <a
                  href="#beer"
                  className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-cream/25 bg-cream/8 px-6 text-sm font-semibold text-cream backdrop-blur-md transition hover:border-cream/55 hover:bg-cream/12"
                >
                 Sörkínálat
                </a>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-20 h-14 w-px -translate-x-1/2 overflow-hidden bg-cream/16">
            <span className="block h-1/2 w-full animate-[pulse_1.8s_ease-in-out_infinite] bg-nectar" />
          </div>
        </section>

        <section id="beer" className="brewery-section relative bg-[#eaf6ff] px-5 py-24 text-slate-950 sm:px-8 lg:px-12 lg:py-36">
          <div className="section-reveal mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.82fr_1fr]">
            <div className="premium-reveal">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-moss">The Brewery</p>
              <h2 className="font-display text-5xl font-semibold leading-none text-mulberry sm:text-7xl">
                Brewing as a slow practice.
              </h2>
            </div>
            <div className="premium-reveal max-w-2xl text-lg leading-8 text-ink/70">
              LEKO Brewing Co. makes modern beer with a restrained hand: clean lagers,
              soft hazy ales, precise wheat beers, and hop-forward releases built around
              balance. The work is patient, natural, and obsessive in the details.
            </div>
          </div>

          <div className="brewery-stats section-reveal mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-3">
            {[
              ["500ml", "Tall Cans"],
              ["Small", "Batch Size"],
              ["Hungary", "Brewed In"]
            ].map(([value, label]) => (
              <div key={label} className="brewery-stat transform-gpu border-t border-ink/15 py-7 [transform-style:preserve-3d]">
                <div className="font-display text-5xl font-semibold text-mulberry">{value}</div>
                <div className="mt-2 text-xs font-bold uppercase tracking-[0.26em] text-ink/45">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="product-showcase relative isolate overflow-hidden bg-[#071426] px-5 py-24 text-sky-50 sm:px-8 lg:px-12 lg:py-32">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_35%,rgba(56,189,248,0.22),transparent_28rem),radial-gradient(circle_at_76%_62%,rgba(20,184,166,0.14),transparent_30rem),linear-gradient(180deg,#071426,#0a1b2d)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.88fr_1fr_0.88fr]">
            <div className="showcase-can showcase-can-left h-[28rem] min-h-80">
              <div className="product-can-stage h-full w-full">
                <ProductCanCanvas cameraZ={4.6} scale={1.18} idleSpeed={0.22} />
              </div>
            </div>

            <div className="section-reveal relative z-10 text-center">
              <p className="premium-reveal mb-5 text-xs font-bold uppercase tracking-[0.34em] text-sky-200/80">
                Product Showcase
              </p>
              <h2 className="premium-reveal font-display text-5xl font-semibold leading-none text-cream sm:text-7xl">
                The can becomes the story.
              </h2>
              <p className="premium-reveal mx-auto mt-7 max-w-xl text-lg leading-8 text-sky-50/68">
                Slow-moving product renders bring the label, aluminium, and silhouette into the lower page without competing with the hero.
              </p>
            </div>

            <div className="showcase-can showcase-can-right h-[28rem] min-h-80">
              <div className="product-can-stage h-full w-full">
                <ProductCanCanvas cameraZ={4.6} scale={1.18} rotation={[0.02, Math.PI * 0.72, 0]} idleSpeed={-0.18} />
              </div>
            </div>
          </div>
        </section>

       <section className="ingredients-section relative overflow-hidden bg-[#dff3ff] px-5 py-24 text-slate-950 sm:px-8 lg:px-12 lg:py-32">
         <div className="ingredients-gradient pointer-events-none absolute -inset-x-24 top-0 h-full bg-[linear-gradient(120deg,rgba(56,189,248,0.18),transparent_34%,rgba(20,184,166,0.12)_58%,rgba(168,85,247,0.14))] opacity-80" />
         <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#eaf6ff] to-transparent" />
          <div className="section-reveal relative mx-auto max-w-7xl">
            <p className="premium-reveal mb-5 text-xs font-bold uppercase tracking-[0.34em] text-pine/70">Ingredients</p>
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr]">
              <h2 className="premium-reveal font-display text-5xl font-semibold leading-none text-pine sm:text-7xl">
                Natural inputs, carefully edited.
              </h2>
              <div className="ingredients-grid grid gap-3 sm:grid-cols-2">
                {ingredients.map((item, index) => (
                  <article
                    key={item.name}
                    className="ingredient-card tilt-card min-h-44 transform-gpu border border-pine/15 bg-cream/36 p-6 shadow-[0_18px_60px_rgba(86,59,28,0.08)] backdrop-blur transition-shadow duration-500 [transform-style:preserve-3d] hover:shadow-[0_28px_90px_rgba(14,116,144,0.16)]"
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

        <section className="can-transition relative isolate h-[70vh] min-h-[34rem] overflow-hidden bg-[#081827]">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_45%,rgba(56,189,248,0.18),transparent_26rem),linear-gradient(180deg,#dff3ff_0%,#081827_18%,#081827_82%,#f9efd2_100%)]" />
          <div className="transition-can absolute left-1/2 top-1/2 h-[34rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 sm:h-[42rem] sm:w-[22rem]">
            <div className="product-can-stage h-full w-full drop-shadow-[0_50px_110px_rgba(56,189,248,0.22)]">
              <ProductCanCanvas cameraZ={4.7} scale={1.22} rotation={[0.04, Math.PI * 1.12, -0.02]} idleSpeed={0.12} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto max-w-7xl px-5 text-xs font-bold uppercase tracking-[0.36em] text-sky-100/38 sm:px-8 lg:px-12">
            Scroll-poured product motion
          </div>
        </section>

        <section className="philosophy relative overflow-hidden bg-[#081827] px-5 py-24 text-sky-50 sm:px-8 lg:px-12 lg:py-36">
          <div className="philosophy-motif pointer-events-none absolute -right-24 top-10 h-[24rem] w-[42rem] text-nectar/23 sm:h-[32rem]">
            <BonsaiMotif className="h-full w-full" />
          </div>
          <div className="section-reveal relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1fr]">
            <div className="premium-reveal">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-nectar/80">
                Brewing Philosophy
              </p>
              <h2 className="font-display text-5xl font-semibold leading-none sm:text-7xl">
                Nature, edited with patience.
              </h2>
            </div>
            <div className="philosophy-copy premium-reveal grid gap-8 text-lg leading-8 text-cream/72">
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

        <section id="lineup" className="relative overflow-hidden bg-[#f9efd2] px-5 py-24 text-ink sm:px-8 lg:px-12 lg:py-36">
          <div className="floating-can-mark pointer-events-none absolute right-6 top-16 hidden h-56 w-24 rounded-[999px] border border-cyan-900/10 bg-[linear-gradient(180deg,rgba(14,116,144,0.18),rgba(255,255,255,0.26),rgba(88,28,135,0.14))] opacity-40 shadow-[0_30px_100px_rgba(14,116,144,0.16)] md:block" />
          <div className="section-reveal relative mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="premium-reveal">
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-moss">Beer Lineup</p>
                <h2 className="font-display text-5xl font-semibold leading-none text-mulberry sm:text-7xl">
                  Four ways into the trees.
                </h2>
              </div>
              <p className="premium-reveal max-w-md leading-7 text-ink/60">
                A calm release family built around haze, clarity, shade, and sun.
              </p>
            </div>

            <div className="beer-grid grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {beers.map(([name, style, abv, note]) => (
                <article
                  key={name}
                  className="beer-card tilt-card group relative min-h-[29rem] transform-gpu overflow-hidden border border-ink/10 bg-white/42 p-6 pt-44 shadow-[0_20px_70px_rgba(70,48,30,0.08)] transition duration-500 [transform-style:preserve-3d] hover:bg-white/65 hover:shadow-[0_32px_110px_rgba(14,116,144,0.18)]"
                >
                  <div className="absolute inset-x-5 top-5 h-36 overflow-hidden border border-cyan-950/10 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.28),transparent_13rem),linear-gradient(135deg,rgba(217,154,163,0.28),rgba(246,199,111,0.32)_48%,rgba(14,116,144,0.18))] shadow-inner">
                    <div className="lineup-can-shell absolute left-1/2 top-0 h-64 w-36 -translate-x-1/2 -translate-y-[42%] transition-transform duration-700 ease-out group-hover:-translate-y-[55%] group-focus-within:-translate-y-[55%]">
                      <ProductCanCanvas cameraZ={4.5} scale={0.82} rotation={[0.03, Math.PI * 0.95, 0]} idleSpeed={0.2} />
                    </div>
                  </div>
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

        <section className="final-cta relative overflow-hidden bg-ink px-5 py-24 text-cream sm:px-8 lg:px-12 lg:py-32">
          <div className="cta-glow absolute -inset-16 bg-[radial-gradient(circle_at_50%_25%,rgba(56,189,248,0.18),transparent_28rem),radial-gradient(circle_at_72%_82%,rgba(168,85,247,0.16),transparent_25rem),radial-gradient(circle_at_26%_70%,rgba(20,184,166,0.14),transparent_24rem)]" />
          <div className="section-reveal relative mx-auto flex min-h-[56vh] max-w-5xl flex-col items-center justify-center text-center">
            <p className="cta-reveal mb-5 text-xs font-bold uppercase tracking-[0.34em] text-nectar/80">LEKO Brewing Co.</p>
            <h2 className="cta-reveal font-display text-6xl font-semibold leading-[0.9] drop-shadow-[0_0_46px_rgba(56,189,248,0.16)] sm:text-8xl">
              Beer with room to breathe.
            </h2>
            <p className="cta-reveal mt-7 max-w-2xl text-lg leading-8 text-cream/70">
              A cinematic, nature-led brewing identity for cans that feel considered from
              first glance to last sip.
            </p>
            <a
              href="mailto:hello@lekobrewing.example"
              className="cta-reveal mt-10 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-nectar px-7 text-sm font-bold text-ink shadow-glow transition hover:bg-cream hover:shadow-[0_0_70px_rgba(56,189,248,0.26)]"
            >
              Contact the Brewery <ArrowRight size={17} />
            </a>
          </div>
        </section>
      </main>
    </LenisProvider>
  );
}
