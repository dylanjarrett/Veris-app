// src/app/account/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AppShell from "@/components/AppShell";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  // Safe initials builder
  const initials =
    user.name && user.name.trim().length > 0
      ? user.name
          .trim()
          .split(/\s+/) // string[]
          .map((part: string) => part[0]!) // each part is a string
          .join("")
          .toUpperCase()
      : user.email
      ? user.email[0]!.toUpperCase()
      : "V";

  const displayName = user.name || "Your account";
  const displayEmail = user.email || "";

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Account
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Profile & billing
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage your Veris profile, login and subscription details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-sm font-semibold uppercase text-white shadow-[0_0_18px_rgba(0,0,0,0.7)]">
              {initials}
            </div>
          </div>
        </header>

        {/* Profile card */}
        <div className="rounded-2xl border border-white/10 bg-[#050814]/80 p-5 shadow-[0_0_26px_rgba(0,0,0,0.75)]">
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          <p className="mt-1 text-xs text-slate-400">
            These details are tied to your Veris login.
          </p>

          <dl className="mt-4 grid gap-4 text-sm text-slate-100 md:grid-cols-2">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Name
              </dt>
              <dd className="mt-1 text-sm">{displayName}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Email
              </dt>
              <dd className="mt-1 text-sm break-all">{displayEmail}</dd>
            </div>
          </dl>
        </div>

        {/* Plan / billing placeholder */}
        <div className="rounded-2xl border border-dashed border-white/12 bg-[#050814]/70 p-5 text-sm text-slate-300">
          <h2 className="text-sm font-semibold text-white">Billing</h2>
          <p className="mt-1 text-xs text-slate-400">
            Billing settings will appear here once subscriptions are enabled.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            For now, you&apos;re using the private agent preview environment.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
