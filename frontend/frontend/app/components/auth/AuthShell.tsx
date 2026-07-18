"use client";

import { ReactNode } from "react";

// Shared visual shell for register / login / OTP screens.
// Reuses the same token system as the landing page:
// #1B1035 base · #2A1B54 surface · #2DD4BF teal · #FBBF24 amber
// · #F5F3FF text · #A78BCA muted

export default function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1B1035] text-[#F5F3FF] flex items-center justify-center px-6 py-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes drift { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        .drift { animation: drift 7s ease-in-out infinite; }
      `}</style>

      <div className="absolute w-96 h-96 rounded-full bg-[#2DD4BF]/10 blur-3xl drift pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-2 font-display font-semibold text-lg mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
          EduSense
        </div>

        <div className="bg-[#2A1B54] border border-[#3D2B6B] rounded-3xl p-8">
          <span className="font-mono text-xs text-[#FBBF24]">{eyebrow}</span>
          <h1 className="font-display font-semibold text-2xl mt-2 mb-1 tracking-tight">
            {title}
          </h1>
          <p className="font-body text-sm text-[#A78BCA] mb-7">{subtitle}</p>

          {children}
        </div>

        {footer && (
          <p className="text-center font-body text-sm text-[#A78BCA] mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}