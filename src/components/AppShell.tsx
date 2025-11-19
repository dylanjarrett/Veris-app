// src/components/AppShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";

interface AppShellProps {
  children: ReactNode;
}

// Top nav (Account now lives under avatar menu)
const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/", label: "Intelligence" },
];

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Helpers to build initials from the user name / email
  const getInitials = () => {
    const name = session?.user?.name || session?.user?.email || "";
    if (!name) return "V"; // fallback

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut({ callbackUrl: "/login" });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    function handleClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      {/* Top header bar */}
      <header className="border-b border-white/10 bg-[radial-gradient(circle_at_top,_#1a2b6b_0,_#050814_45%,_#020311_100%)]/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-4 md:px-10 lg:px-20">
          {/* Left: logo + tiny tag */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/veris-logo-wordmark.png"
              alt="Veris Automation"
              className="w-[150px] h-auto md:w-[180px]"
            />
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-[#AAB4C0] md:inline">
              Real Estate Agent
            </span>
          </Link>

          {/* Right: nav + preview pill + user */}
          <div className="flex items-center gap-6">
            {/* Nav */}
            <nav className="hidden items-center gap-4 text-xs text-[#AAB4C0] md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-1 transition-colors ${
                    isActive(item.href)
                      ? "text-white"
                      : "hover:text-white/90"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-[2px] rounded-full bg-gradient-to-r from-[#4D9FFF] via-[#7C5CFF] to-[#4D9FFF]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Preview pill + tagline */}
            <div className="hidden flex-col items-end text-right text-xs text-[#AAB4C0] sm:flex">
              <span className="inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
                Private agent preview
              </span>
              <span className="mt-1 text-[11px]">
                Your AI Advantage in Real Estate.
              </span>
            </div>

            {/* User avatar / auth control */}
            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  title={session.user?.email || "Account"}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/5 text-[11px] font-semibold uppercase text-white shadow-[0_0_14px_rgba(0,0,0,0.7)] hover:border-[#4D9FFF] hover:bg-[#11182A] hover:shadow-[0_0_20px_rgba(77,159,255,0.65)] transition"
                >
                  {getInitials()}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#050814]/98 py-1 text-xs shadow-[0_18px_45px_rgba(0,0,0,0.65)]">
                    <div className="px-3 py-2 text-[11px] text-[#9CA3AF]">
                      Signed in as
                      <div className="truncate text-[11px] text-[#E5E7EB]">
                        {session.user?.email || session.user?.name}
                      </div>
                    </div>
                    <div className="my-1 h-px bg-white/5" />

                    {/* Account */}
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-[12px] text-[#E5E7EB] hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      Account
                    </Link>

                    {/* Billing */}
                    <Link
                      href="/billing"
                      className="block px-3 py-2 text-[12px] text-[#E5E7EB] hover:bg-white/5"
                      onClick={() => setMenuOpen(false)}
                    >
                      Billing
                    </Link>

                    <div className="my-1 h-px bg-white/5" />

                    {/* Sign out */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center justify-between px-3 py-2 text-[12px] text-red-200 hover:bg-red-500/10"
                    >
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs text-[#E5E7EB] hover:border-[#4D9FFF] hover:bg-[#11182A] transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="px-4 py-6 md:px-10 lg:px-20">{children}</main>
    </div>
  );
}