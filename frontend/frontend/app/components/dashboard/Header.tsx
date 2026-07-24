"use client";

import { useEffect, useState } from "react";
import { getStoredUser, StoredUser } from "@/app/lib/auth";

export default function Header({ title }: { title: string }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setUser(getStoredUser());

    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "S";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 bg-[#1B1035]/90 backdrop-blur-sm border-b border-[#2A1B54]">
      <div>
        <h1 className="font-display font-semibold text-xl text-[#F5F3FF]">
          {title}
        </h1>

        <p className="font-mono text-xs text-[#A78BCA] mt-0.5">
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 rounded-full border border-[#3D2B6B] flex items-center justify-center text-[#A78BCA] hover:text-[#F5F3FF] hover:border-[#2DD4BF] transition-colors">
          <svg viewBox="0 0 20 20" fill="none" className="w-4.5 h-4.5">
            <path
              d="M15 7a5 5 0 00-10 0c0 4-2 5-2 5h14s-2-1-2-5M8.5 15a1.5 1.5 0 003 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-[#2A1B54]">
          <div className="text-right">
            <div className="font-body text-sm text-[#F5F3FF] leading-tight">
              {user?.name || "Student"}
            </div>

            <div className="font-mono text-[10px] text-[#A78BCA]">
              {user?.role || "STUDENT"}
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2DD4BF] to-[#5B21B6] flex items-center justify-center font-display font-semibold text-sm text-[#1B1035]">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}