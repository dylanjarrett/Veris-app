// src/app/account/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountForm from "./AccountForm";
import AppShell from "@/components/AppShell";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      brokerage: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const initials =
    user.name
      ?.split(" ")
      .map((n: any[]) => n[0])
      .join("")
      .toUpperCase() || user.email[0].toUpperCase();

  return (
    <AppShell>
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left panel */}
        <aside className="w-full md:w-64">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-lg font-semibold text-slate-100">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">
                  {user.name || "New Veris agent"}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-xs text-slate-400">
              <p>These details help Veris tune insights for your market, team, and workflow.</p>
            </div>
          </div>
        </aside>

        {/* Right panel – form */}
        <section className="flex-1">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/40">
            <h1 className="text-xl font-semibold text-white">Account settings</h1>
            <p className="mt-1 text-sm text-slate-400">
              Keep your profile up to date so Veris can reference your name,
              brokerage, and branding in AI outputs.
            </p>

            <div className="mt-6">
              <AccountForm user={user} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}