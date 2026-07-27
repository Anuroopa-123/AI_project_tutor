"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Logo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30, filter: "blur(10px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 0.85, y: 0, duration: 1, ease: "power2.out" },
          "-=0.6"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-10 text-center px-4"
    >
      <div
        ref={badgeRef}
        className="mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.25)]"
      >
        ✦ Next Generation AI Engine
      </div>

      <h1
        ref={titleRef}
        className="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]"
      >
        NOVA AI WORKSPACE
      </h1>

      <p
        ref={subtitleRef}
        className="mt-4 text-lg md:text-xl text-slate-300 max-w-xl font-light tracking-wide drop-shadow"
      >
        Experience infinite intelligence in volumetric space.
      </p>
    </div>
  );
}
