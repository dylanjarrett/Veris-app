// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // While NextAuth is checking the session
  if (status === "loading") {
    return (
      <AppShell>
        <div className="flex h-[60vh] items-center justify-center text-sm text-slate-400">
          Loading your dashboard…
        </div>
      </AppShell>
    );
  }

  // If we’re redirecting away
  if (!session) {
    return null;
  }

  const firstName =
    session.user?.name?.split(" ")[0] ??
    session.user?.email?.split("@")[0] ??
    "there";

  return (
    <AppShell>
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Hey {firstName}, let&apos;s work your pipeline.
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/account"
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-100 hover:border-[#4D9FFF] hover:bg-[#11182A] transition"
          >
            View account
          </Link>
          <Link
            href="/"
            className="rounded-full bg-[#1A73E8] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(26,115,232,0.55)] hover:bg-[#1557B0] transition"
          >
            New AI brief
          </Link>
        </div>
      </header>

      {/* Cards row */}
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.96)] p-5 shadow-[0_0_22px_rgba(0,0,0,0.65)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Today&apos;s focus
          </p>
          <h2 className="mt-3 text-sm font-semibold text-white">
            Follow up with hot leads
          </h2>
          <p className="mt-2 text-xs text-slate-300">
            Veris will prioritize buyers most likely to move in the next 30
            days once we hook up your CRM.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.96)] p-5 shadow-[0_0_22px_rgba(0,0,0,0.65)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Market snapshot
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">—</p>
          <p className="mt-2 text-xs text-slate-300">
            We&apos;ll show inventory, days-on-market, and pricing trends once
            you pick your primary farm area.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.96)] p-5 shadow-[0_0_22px_rgba(0,0,0,0.65)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
            Tasks
          </p>
          <ul className="mt-3 space-y-2 text-xs text-slate-300">
            <li>• Connect your MLS or CRM</li>
            <li>• Add your brokerage + brand details</li>
            <li>• Create your first AI briefing for a listing</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-dashed border-white/15 bg-[rgba(7,10,20,0.9)] p-6 text-xs text-slate-300">
        This area will become your activity feed — AI summaries of new leads,
        listing changes, and market shifts.
      </section>
    </AppShell>
  );
}