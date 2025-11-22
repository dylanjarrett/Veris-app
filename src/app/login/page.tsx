"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/page-header";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const errorParam = params.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      alert(res.error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md space-y-8 pt-16">
      <PageHeader
        eyebrow="WELCOME BACK"
        title="Log in to Avillo"
        subtitle="Access your CRM, listings, and AI workflows from one place."
      />

      {errorParam && (
        <p className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
          {errorParam === "OAuthAccountNotLinked"
            ? "This email is already used with a different login method."
            : "Login failed. Please try again."}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6 shadow-lg"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-amber-200/80"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-amber-200/80"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full border border-amber-100/70 bg-amber-50/10 px-4 py-2 text-sm font-semibold text-amber-100 shadow-[0_0_25px_rgba(248,250,252,0.15)] hover:bg-amber-50/20 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <button
          type="button"
          onClick={() => signIn("google")}
          className="mt-2 w-full rounded-full border border-slate-600/70 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800/80"
        >
          Continue with Google
        </button>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <a href="/signup" className="hover:text-amber-100">
            Create an account
          </a>
          <a href="/forgot-password" className="hover:text-amber-100">
            Forgot password?
          </a>
        </div>
      </form>
    </div>
  );
}