"use client";

import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/app/lib/auth";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Overview", icon: "grid" },
  { href: "/student/courses", label: "My Courses", icon: "book" },
  { href: "/student/quiz", label: "Quizzes", icon: "check" },
  { href: "/student/chatbot", label: "Ask Luna", icon: "chat" },
  { href: "/student/progress", label: "My Progress", icon: "chart" },
  { href: "/student/settings", label: "Settings", icon: "gear" },
];

const ICONS: Record<string, JSX.Element> = {
  grid: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  book: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 4a2 2 0 012-2h8a2 2 0 012 2v13l-6-3-6 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <rect x="2.5" y="2.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 10l2.5 2.5L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 4h14v9H7l-4 3.5V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <path d="M3 17V9m5.5 8V4M14 17v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gear: (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2.5v2M10 15.5v2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M2.5 10h2M15.5 10h2M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col bg-[#2A1B54] border-r border-[#3D2B6B]">
      <div className="px-6 py-6 flex items-center gap-2 font-display font-semibold text-lg text-[#F5F3FF]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" />
        EduSense
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-colors ${
                active
                  ? "bg-[#2DD4BF]/15 text-[#2DD4BF]"
                  : "text-[#A78BCA] hover:bg-[#1B1035] hover:text-[#F5F3FF]"
              }`}
            >
              {ICONS[item.icon]}
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm text-[#A78BCA] hover:bg-[#1B1035] hover:text-[#FBBF24] transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
            <path d="M7 3H4.5A1.5 1.5 0 003 4.5v11A1.5 1.5 0 004.5 17H7M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}