// src/app/reset-password/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isLinkInvalid = useMemo(() => !token || !email, [token, email]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isLinkInvalid) return;

    if (newPassword !== confirm) {
      setStatus("error");
      setMessage("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Please request a new reset link.");
        return;
      }

      setStatus("success");
      setMessage("Password updated successfully. You can now log in with your new password.");
      // Small delay then redirect to login
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("reset-password error", err);
      setStatus("error");
      setMessage("Something went wrong. Please request a new reset link.");
    }
  }

  const isSubmitting = status === "loading";

  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(7,10,20,0.96)] p-6 shadow-[0_0_26px_rgba(0,0,0,0.7)]">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9CA3AF]">
            Account
          </p>
          <h1 className="mt-2 text-xl font-semibold text-white">Choose a new password</h1>
          <p className="mt-2 text-xs text-[#AAB4C0]">
            For security, this link will expire after a short period. Enter a strong new password
            to secure your Veris account.
          </p>

          {isLinkInvalid ? (
            <div className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">
              This reset link is missing information or is invalid. Request a new link from the{" "}
              <a
                href="/forgot-password"
                className="font-medium text-red-100 underline-offset-2 hover:underline"
              >
                forgot password page
              </a>
              .
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9CA3AF]"
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-[#020617] px-3 py-2 text-sm text-white outline-none ring-0 transition placeholder:text-[#64748B] focus:border-[#4D9FFF] focus:ring-1 focus:ring-[#4D9FFF]"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9CA3AF]"
                >
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-[#020617] px-3 py-2 text-sm text-white outline-none ring-0 transition placeholder:text-[#64748B] focus:border-[#4D9FFF] focus:ring-1 focus:ring-[#4D9FFF]"
                  placeholder="Repeat new password"
                />
              </div>

              {message && (
                <div
                  className={`rounded-lg px-3 py-2 text-[11px] ${
                    status === "success"
                      ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border border-red-500/40 bg-red-500/10 text-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isLinkInvalid}
                className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#1A73E8] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(26,115,232,0.55)] transition hover:bg-[#1557B0] disabled:cursor-not-allowed disabled:bg-[#1f2937] disabled:text-[#9CA3AF]"
              >
                {isSubmitting ? "Updating password…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </AppShell>
  );
} 