"use client";

import { useEffect, useRef } from "react";

export function LandingAnimations() {
  const cleanups = useRef<(() => void)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll<HTMLElement>(".tilt-card").forEach((card) => {
      const onMove = (event: PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-x", `${y * -4}deg`);
        card.style.setProperty("--tilt-y", `${x * 5}deg`);
      };

      const onLeave = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };

      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
      cleanups.current.push(() => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => {
      cleanups.current.forEach((cleanup) => cleanup());
      cleanups.current = [];
    };
  }, []);

  return (
    <style jsx global>{`
      @keyframes slideDown {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(200%); }
      }

      @keyframes softFloat {
        0%, 100% { transform: translate3d(0, 0, 0); }
        50% { transform: translate3d(0, -10px, 0); }
      }

      .landing-root::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: 9999;
        pointer-events: none;
        opacity: 0.02;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 180px 180px;
      }

      .section-reveal,
      .beer-card,
      .cta-reveal {
        opacity: 1;
        transform: none;
      }

      .split-word {
        animation: wordIn 900ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }

      .split-word:nth-child(2) {
        animation-delay: 90ms;
      }

      @keyframes wordIn {
        from { transform: translateY(110%); }
        to { transform: translateY(0); }
      }

      .float-chip {
        animation: softFloat 5.4s ease-in-out infinite;
      }

      .float-chip-delay {
        animation-delay: 1.1s;
      }

      .tilt-card {
        transform: perspective(900px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
      }

      html.lenis {
        height: auto;
      }
      .lenis.lenis-smooth {
        scroll-behavior: auto;
      }
      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }

      @media (prefers-reduced-motion: reduce) {
        .section-reveal,
        .beer-card,
        .cta-reveal,
        .split-word,
        .float-chip {
          animation: none;
          opacity: 1;
          transform: none;
          transition: none;
        }
      }
    `}</style>
  );
}
