"use client";

import { FormEvent, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      alert("Reset link is invalid.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Could not reset password.");
      return;
    }

    alert("Password updated. You can now log in.");
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-md space-y-8 pt-16">
      <PageHeader
        eyebrow="RESET PASSWORD"
        title="Set a new password"
        subtitle="Choose a strong password to secure your Avillo account."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6 shadow-lg"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200">
            New password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-amber-200/80"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full border border-amber-100/70 bg-amber-50/10 px-4 py-2 text-sm font-semibold text-amber-100 shadow-[0_0_25px_rgba(248,250,252,0.15)] hover:bg-amber-50/20 disabled:opacity-60"
        >
          {loading ? "Updating password..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
