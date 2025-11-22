"use client";

import React, { useState } from "react";
import PageHeader from "@/components/layout/page-header";
import { generateAI } from "@/lib/intelligence";
import { pushToCRM } from "@/lib/crm";

// -----------------------------
// Elegant UI card
// -----------------------------
function IntelligenceCard({ title, kicker, children }: any) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-950/80 p-6 shadow-[0_0_40px_rgba(15,23,42,0.85)] transition-all hover:border-amber-100/40">
      <div className="absolute inset-0 -z-10 opacity-0 blur-3xl group-hover:opacity-40 bg-[radial-gradient(circle_at_top,_rgba(248,250,252,0.14),transparent_55%)] transition-opacity" />
      {kicker && (
        <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-100/70 uppercase mb-2">
          {kicker}
        </p>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-slate-50 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

// -----------------------------
// Textarea with elegant styling
// -----------------------------
function InputBox({ label, value, onChange }: any) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-slate-200 mb-1">{label}</p>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/40 p-3 text-sm text-slate-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-200/30 focus:border-amber-100"
      />
    </div>
  );
}

// -----------------------------
// MAIN COMPONENT
// -----------------------------
export default function IntelligencePage() {
  const [propertyNotes, setPropertyNotes] = useState("");
  const [clientType, setClientType] = useState("buyer");
  const [tone, setTone] = useState("professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Run AI engine
  async function runAI(mode: string) {
    setLoading(true);
    setOutput("");

    const result = await generateAI({
      mode,
      propertyNotes,
      clientType,
      tone,
    });

    setOutput(result?.text || "No output generated.");
    setLoading(false);
  }

  // Push result to CRM
  async function handlePushToCRM() {
    if (!output) return;
    await pushToCRM({
      raw: propertyNotes,
      processed: output,
      type: clientType,
    });
    alert("Saved to CRM!");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="INTELLIGENCE"
        title="Listing Intelligence & Studios"
        subtitle="Turn raw notes into ready-to-use listing copy, scripts, briefs, and marketing assets built for both buyers and sellers."
      />

      {/* INPUT SECTION */}
      <IntelligenceCard
        kicker="Listing Intelligence Input"
        title="Paste your full property notes below"
      >
        <InputBox
          label="Property notes"
          value={propertyNotes}
          onChange={setPropertyNotes}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-xs text-slate-200/70">Client Type</label>
            <select
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              className="w-full mt-1 rounded-lg border border-slate-700 bg-slate-900/40 p-2 text-sm text-slate-100"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-200/70">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full mt-1 rounded-lg border border-slate-700 bg-slate-900/40 p-2 text-sm text-slate-100"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="luxury">Luxury</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => runAI("listing")}
            className="rounded-xl bg-amber-100/20 border border-amber-200/40 px-4 py-2 text-sm font-medium text-amber-100 shadow hover:bg-amber-100/30"
          >
            Generate Listing Pack
          </button>

          <button
            onClick={() => runAI("seller")}
            className="rounded-xl bg-slate-800/50 border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/70"
          >
            Seller Studio Output
          </button>

          <button
            onClick={() => runAI("buyer")}
            className="rounded-xl bg-slate-800/50 border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/70"
          >
            Buyer Studio Output
          </button>
        </div>
      </IntelligenceCard>

      {/* OUTPUT SECTION */}
      <IntelligenceCard title="Output Preview">
        <div className="min-h-[200px] whitespace-pre-wrap text-slate-100 text-sm">
          {loading ? (
            <p className="animate-pulse text-amber-100">Generating…</p>
          ) : (
            output || "Run an AI workflow to see results here."
          )}
        </div>

        {output && (
          <button
            onClick={handlePushToCRM}
            className="mt-5 rounded-full border border-amber-100/60 bg-amber-50/5 px-4 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-50/10"
          >
            Save to CRM
          </button>
        )}
      </IntelligenceCard>
    </div>
  );
}