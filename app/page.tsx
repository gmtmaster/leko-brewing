"use client";

import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BonsaiMotif } from "@/components/BonsaiMotif";
import { LenisProvider } from "@/components/LenisProvider";
import { useEffect, useRef } from "react";

// ─── Dynamic imports (SSR-disabled) ────────────────────────────────────────
const BeerCanScene = dynamic(
  () => import("@/components/BeerCanScene").then((m) => m.BeerCanScene),
  { ssr: false }
);

const ProductCanCanvas = dynamic(
  () => import("@/components/ProductCanCanvas").then((m) => m.ProductCanCanvas),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  }
);

// ─── Data ───────────────────────────────────────────────────────────────────
const beers = [
  {
    name: "Daylight Haze",
    style: "Hazy IPA",
    abv: "6.8%",
    note: "Trópusi gyümölcs, citrus, puha kortyérzet",
    accent: "#38bdf8",
    labelSrc: "/textures/daylight-haze-label.png",
  },
  {
    name: "Sweet Illusion",
    style: "American Wheat",
    abv: "4.5%",
    note: "Narancs, korianderlehelet, nyári frissesség",
    accent: "#f6c76f",
    labelSrc: "/textures/sweet_illusion.png",
  },
  {
    name: "Luna Blanca",
    style: "Witbier",
    abv: "5.1%",
    note: "Fehér citrus, koriander, lágy búzás alap",
    accent: "#e0f2fe",
    labelSrc: "/textures/luna-blanca-label.png",
  },
  {
    name: "West Coast IPA",
    style: "West Coast IPA",
    abv: "6.8%",
    note: "Grapefruit, fenyőgyanta, száraz lecsengés",
    accent: "#86efac",
    labelSrc: "/textures/west-coast-ipa-label.png",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── Page ───────────────────────────────────────────────────────────────────
export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const cardCleanups = useRef<Array<() => void>>([]);

  useEffect(() => {
    if (!rootRef.current) return;

    cardCleanups.current = [];
    let refreshId: ReturnType<typeof setTimeout> | undefined;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ── 1. Wait for dynamic canvases then refresh ──────────────────────
      refreshId = setTimeout(() => ScrollTrigger.refresh(), 600);

      // ── 2. Hero split-word entrance ────────────────────────────────────
      gsap.set(".split-word", { y: "110%" });
      gsap.to(".split-word", {
        y: "0%",
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.048,
        delay: 0.3,
      });

      // ── 3. Hero copy parallax (keeps BeerCanScene pin untouched) ───────
      gsap.to(".hero-copy", {
        yPercent: -18,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-pin",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      if (prefersReducedMotion) {
        gsap.set(
          ".section-reveal, .beer-card, .cta-reveal, .final-can-frame",
          { y: 0, opacity: 1, filter: "none", clearProps: "transform" }
        );
        return;
      }

      // ── 4. Section reveals (shared across page) ────────────────────────
      gsap.utils.toArray<HTMLElement>(".section-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          }
        );
      });

      // ── 5. Beer cards ──────────────────────────────────────────────────
      gsap.fromTo(
        ".beer-card",
        { autoAlpha: 0, y: 70, rotateX: 10, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.0,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".beer-grid", start: "top 78%" },
        }
      );

      // ── 6. Beer card tilt ──────────────────────────────────────────────
      document
        .querySelectorAll<HTMLElement>(".tilt-card")
        .forEach((card) => {
          const setRX = gsap.quickTo(card, "rotateX", {
            duration: 0.42,
            ease: "power3.out",
          });
          const setRY = gsap.quickTo(card, "rotateY", {
            duration: 0.42,
            ease: "power3.out",
          });
          const setY = gsap.quickTo(card, "y", {
            duration: 0.42,
            ease: "power3.out",
          });

          const onMove = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            setRX(y * -6);
            setRY(x * 8);
            setY(-6);
          };
          const onLeave = () => {
            setRX(0);
            setRY(0);
            setY(0);
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cardCleanups.current.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

      // ── 7. CTA reveals ─────────────────────────────────────────────────
      gsap.fromTo(
        ".cta-reveal",
        { autoAlpha: 0, y: 32, filter: "blur(10px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.15,
          ease: "power3.out",
          stagger: 0.11,
          scrollTrigger: { trigger: ".final-cta", start: "top 72%" },
        }
      );

      gsap.fromTo(
        ".final-can-frame",
        { autoAlpha: 0, y: 50, scale: 0.88, rotate: -3 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".final-cta", start: "top 72%" },
        }
      );

      // ── 8. Parallax haze ───────────────────────────────────────────────
      gsap.to(".parallax-haze", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: ".landing-root",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

    }, rootRef);

    return () => {
      if (refreshId) clearTimeout(refreshId);
      cardCleanups.current.forEach((fn) => fn());
      cardCleanups.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <LenisProvider>
      <main ref={rootRef} className="landing-root min-h-screen overflow-x-hidden bg-[#06111f] text-[#f2ede4]">

        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <section className="hero-pin relative isolate flex min-h-screen items-center overflow-hidden bg-[#06111f] px-5 py-6 sm:px-8 lg:px-14">
          {/* Ambient haze */}
          <div className="parallax-haze pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_22%,rgba(56,189,248,0.26),transparent_36rem),radial-gradient(ellipse_at_74%_18%,rgba(168,85,247,0.18),transparent_32rem),radial-gradient(ellipse_at_50%_88%,rgba(20,184,166,0.16),transparent_36rem)]" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#06111f]/80 to-transparent" />
          </div>

          {/* Nav */}
          <nav className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 text-[0.64rem] uppercase tracking-[0.34em] text-[#f2ede4]/60 sm:px-8 lg:px-14">
            <span className="font-semibold tracking-[0.28em]">LEKO</span>
            <span className="hidden sm:block">Magyarország · kis széria · dobozos craft beer</span>
            <a
              href="#lineup"
              className="rounded-full border border-[#f2ede4]/20 px-4 py-1.5 transition hover:border-[#f2ede4]/50"
            >
              Sörkínálat
            </a>
          </nav>

          {/* 3D scene — full bleed */}
          <div className="absolute inset-0 z-0">
            <BeerCanScene />
          </div>

          {/* Copy */}
          <div className="hero-copy pointer-events-none relative z-10 mx-auto w-full max-w-7xl pt-24">
            <p className="mb-6 text-[0.64rem] font-semibold uppercase tracking-[0.46em] text-[#38bdf8]/80">
              Kis szériás sörök türelemmel és megszállott figyelemmel
            </p>
            <h1 className="max-w-5xl font-serif text-[14vw] font-bold uppercase leading-[0.82] tracking-[-0.02em] text-[#f2ede4] sm:text-[11vw] lg:text-[8rem]">
              {"LEKO BREWING CO.".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="mr-[0.16em] inline-block overflow-hidden align-top"
                >
                  <span className="split-word inline-block">{word}</span>
                </span>
              ))}
            </h1>

            <div className="pointer-events-auto mt-12 flex flex-wrap items-center gap-4">
              <a
                href="#lineup"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#38bdf8] px-7 text-sm font-semibold text-[#06111f] shadow-[0_0_40px_rgba(56,189,248,0.3)] transition hover:bg-white"
              >
                Fedezd fel <ArrowRight size={16} />
              </a>
              <a
                href="#about"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[#f2ede4]/20 px-7 text-sm font-semibold text-[#f2ede4] backdrop-blur-sm transition hover:border-[#f2ede4]/50"
              >
                A sör mögött
              </a>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-[0.58rem] uppercase tracking-[0.38em] text-[#f2ede4]/36">Scroll</span>
            <div className="h-12 w-px overflow-hidden bg-[#f2ede4]/14">
              <div className="h-1/2 w-full animate-[slideDown_2s_ease-in-out_infinite] bg-[#38bdf8]" />
            </div>
          </div>
        </section>

        {/* ─── ABOUT ────────────────────────────────────────────────────── */}
        <section
          id="about"
          className="relative overflow-hidden bg-[#06111f] px-5 py-24 text-[#f2ede4] sm:px-8 lg:px-14 lg:py-28"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#06111f] to-transparent" />
          <BonsaiMotif className="pointer-events-none absolute right-[-7rem] top-1/2 h-[22rem] w-[38rem] -translate-y-1/2 text-[#f2ede4]/[0.035] sm:right-[-4rem] lg:right-[4vw]" />

          <div className="section-reveal relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.58fr_1fr] lg:items-start">
            <div>
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.4em] text-[#38bdf8]/70">
                About LEKO
              </p>
              <div className="mt-8 hidden h-px w-24 bg-gradient-to-r from-[#38bdf8]/50 to-transparent lg:block" />
            </div>

            <div className="max-w-4xl">
              <h2 className="font-serif text-[clamp(2.9rem,7vw,6.8rem)] font-bold leading-[0.9] tracking-[-0.03em]">
                Crafted with patience. Shared with purpose.
              </h2>
              <div className="mt-9 max-w-2xl space-y-5 text-base leading-8 text-[#f2ede4]/62 sm:text-lg sm:leading-8">
                <p>
                  At LEKO Brewing Co., we believe great beer doesn&apos;t need
                  to shout. It should be balanced, memorable, and brewed with
                  the same attention to detail that goes into everything we
                  create.
                </p>
                <p>
                  From bright, hop-forward IPAs to clean, easy-drinking lagers,
                  every recipe is developed in small batches with one goal:
                  making beers we genuinely love to drink ourselves.
                </p>
                <p>
                  No shortcuts. No unnecessary complexity. Just honest brewing
                  and unforgettable moments.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── LINEUP ───────────────────────────────────────────────────── */}
        <section
          id="lineup"
          className="relative overflow-hidden bg-[#f7ead8] px-5 py-24 text-[#18120a] sm:px-8 lg:px-14 lg:py-36"
        >
          {/* Top bleed */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#06111f] to-transparent" />

          <div className="mx-auto max-w-7xl">
            <div className="section-reveal mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-4 text-[0.62rem] font-bold uppercase tracking-[0.38em] text-[#7a5a2a]/70">
                  Beer Lineup
                </p>
                <h2 className="font-serif text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.88] tracking-[-0.03em] text-[#18120a]">
                  Négy út a<br />
                  <em className="not-italic text-[#a05c28]">sörök világába.</em>
                </h2>
              </div>
              <p className="max-w-sm text-base leading-7 text-[#18120a]/55">
                Egységes karaktercsalád — eltérő arculattal, azonos figyelemmel főzve.
              </p>
            </div>

            <div className="beer-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {beers.map(({ name, style, abv, note, accent, labelSrc }) => (
                <article
                  key={name}
                  className="beer-card tilt-card group relative flex min-h-[32rem] flex-col overflow-hidden border border-[#18120a]/8 bg-white/55 shadow-[0_18px_60px_rgba(70,48,30,0.07)] [transform-style:preserve-3d] transition-shadow duration-500 hover:shadow-[0_32px_100px_rgba(70,48,30,0.14)]"
                >
                  {/* Can preview */}
                  <div
                    className="relative h-48 w-full overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at 50% 10%, ${accent}22, transparent 60%), linear-gradient(160deg, rgba(255,255,255,0.5), rgba(220,210,190,0.3))`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-start justify-center pt-0">
                      <div className="h-72 w-44 transition-transform duration-700 ease-out group-hover:-translate-y-4">
                        <ProductCanCanvas
                          labelSrc={labelSrc}
                          cameraZ={6.2}
                          cameraY={0.62}
                          fov={26}
                          scale={0.72}
                          position={[0, -0.38, 0]}
                          rotation={[0.02, Math.PI * 0.94, 0]}
                          idleSpeed={0.12}
                        />
                      </div>
                    </div>
                    {/* ABV badge */}
                    <span
                      className="absolute right-4 top-4 rounded-full px-3 py-1 text-[0.62rem] font-bold tracking-[0.18em]"
                      style={{
                        background: `${accent}22`,
                        color: accent,
                        border: `1px solid ${accent}44`,
                      }}
                    >
                      {abv}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between p-6 pt-5">
                    <div>
                      <p className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-[#18120a]/38">
                        {style}
                      </p>
                      <h3 className="font-serif text-[1.9rem] font-bold leading-none tracking-[-0.02em] text-[#18120a]">
                        {name}
                      </h3>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-[#18120a]/58">
                      {note}
                    </p>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className="h-[2px] w-full transition-all duration-500 group-hover:h-[3px]"
                    style={{ background: accent }}
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="final-cta relative overflow-hidden bg-[#06111f] px-5 py-28 text-[#f2ede4] sm:px-8 lg:px-14 lg:py-36">
          {/* Ambient */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(56,189,248,0.16),transparent_30rem),radial-gradient(ellipse_at_78%_80%,rgba(168,85,247,0.14),transparent_28rem)]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1fr]">
            {/* Can */}
            <div
              className="final-can-frame order-2 mx-auto lg:order-1"
              style={{
                width: "clamp(180px,26vw,320px)",
                height: "clamp(340px,50vw,580px)",
              }}
            >
              <ProductCanCanvas
                cameraZ={6.4}
                fov={28}
                scale={0.84}
                rotation={[0.03, Math.PI * 0.86, 0]}
                idleSpeed={0.1}
              />
            </div>

            {/* Copy */}
            <div className="order-1 lg:order-2">
              <p className="cta-reveal mb-5 text-[0.62rem] font-bold uppercase tracking-[0.4em] text-[#38bdf8]/70">
                LEKO Brewing Co.
              </p>
              <h2 className="cta-reveal font-serif text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.88] tracking-[-0.03em] text-[#f2ede4]">
                Kis tétel.{" "}
                <em className="not-italic text-[#38bdf8]">Nagy figyelem.</em>
              </h2>
              <p className="cta-reveal mt-7 max-w-md text-lg leading-8 text-[#f2ede4]/58">
                Egy dobozos sör, ahol a recept, a címke és a mozdulat ugyanabba az irányba mutat.
              </p>
              <div className="cta-reveal mt-10 flex flex-wrap gap-4">
                <a
                  href="mailto:hello@lekobrewing.example"
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#38bdf8] px-7 text-sm font-bold text-[#06111f] shadow-[0_0_40px_rgba(56,189,248,0.28)] transition hover:bg-white"
                >
                  Kapcsolat <ArrowRight size={16} />
                </a>
                <a
                  href="#lineup"
                  className="inline-flex h-12 items-center rounded-full border border-[#f2ede4]/20 px-7 text-sm font-semibold text-[#f2ede4] transition hover:border-[#f2ede4]/50"
                >
                  Sörkínálat
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="border-t border-[#f2ede4]/8 bg-[#06111f] px-5 py-8 sm:px-8 lg:px-14">
          <div className="mx-auto flex max-w-7xl items-center justify-between text-[0.62rem] uppercase tracking-[0.28em] text-[#f2ede4]/28">
            <span>© 2025 LEKO Brewing Co.</span>
            <span>Magyarország</span>
          </div>
        </footer>

      </main>

      {/* ─── Global styles ──────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        /* Grain overlay */
        .landing-root::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.028;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 180px 180px;
        }

        /* Ensure Lenis doesn't fight sticky */
        html.lenis {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
      `}</style>
    </LenisProvider>
  );
}
