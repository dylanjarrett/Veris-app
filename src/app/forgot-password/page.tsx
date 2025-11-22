"use client";

import { FormEvent, useState } from "react";
import PageHeader from "@/components/layout/page-header";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Could not start password reset. Please try again.");
      return;
    }

    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md space-y-8 pt-16">
      <PageHeader
        eyebrow="PASSWORD HELP"
        title="Forgot your password?"
        subtitle="Enter your email and we'll send a link to reset your password."
      />

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
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-200/80"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full border border-amber-100/70 bg-amber-50/10 px-4 py-2 text-sm font-semibold text-amber-100 shadow-[0_0_25px_rgba(248,250,252,0.15)] hover:bg-amber-50/20 disabled:opacity-60"
        >
          {loading ? "Sending link..." : "Send reset link"}
        </button>

        {sent && (
          <p className="mt-3 text-xs text-emerald-200">
            If an account exists with that email, a reset link has been
            generated (check the server console for now).
          </p>
        )}
      </form>
    </div>
  );
}
