"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header({ userName }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "R";

  return (
    <header className="w-full bg-[#181630] border-b border-[#2a2754]/40 px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#7c3aed]/20">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-lg font-bold text-white tracking-tight">FinanceApp</span>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#7c3aed]/10">
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-200">{userName || "Relrison"}</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-all duration-200"
          title="Sair"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>
    </header>
  );
}
