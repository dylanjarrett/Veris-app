"use client";

import { useState } from "react";
import { MOCK_PACK } from "../mock/verisMock";
import { VerisIntelligencePack } from "../types/veris";

type TabId = "listing" | "social" | "emails" | "talking" | "insights" | "pitch";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("listing");
  const [propertyText, setPropertyText] = useState("");
  const [pack, setPack] = useState<VerisIntelligencePack | null>(MOCK_PACK);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!propertyText.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/generate-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyText }),
      });

      if (!res.ok) {
        console.error("API error", await res.text());
        // fallback to mock so UI still shows something
        setPack(MOCK_PACK);
        return;
      }

      const data: VerisIntelligencePack = await res.json();
      setPack(data);
    } catch (err) {
      console.error("Request failed", err);
      // fallback to mock on network error
      setPack(MOCK_PACK);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/50">
              <span className="text-sm font-semibold text-sky-300">V</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Veris
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                AI property intelligence — listing copy, social content & scripts
                in seconds.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
          {/* Left: Input panel */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5">
            <h2 className="text-sm font-medium text-slate-200 mb-2">
              Property details
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Paste an address, MLS link, or property description. Photos and
              advanced options come next.
            </p>

            <textarea
              className="w-full h-40 resize-none rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder={`1234 Ocean View Dr, San Diego, CA 92130\n\nPaste MLS text, bullet points, or a brief description here.`}
              value={propertyText}
              onChange={(e) => setPropertyText(e.target.value)}
            />

            {/* Placeholder for photo upload (we'll wire later) */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Property photos (optional)
              </label>
              <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-3 py-4 text-center">
                <div>
                  <p className="text-xs text-slate-400">
                    Drag & drop images here or click to upload.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Interior, exterior, or yard photos help Veris understand
                    style and features.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !propertyText.trim()}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Analyzing with Veris…" : "Generate Intelligence Pack"}
            </button>

            <p className="mt-2 text-[11px] text-slate-500">
              Veris will create listing copy, social posts, emails, talking
              points, and more — tuned to a modern, professional voice.
            </p>
          </section>

          {/* Right: Results panel */}
          <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 sm:p-5 flex flex-col min-h-[420px]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Property intelligence
                </p>
                <p className="text-sm text-slate-300">
                  Draft, refine, and copy everything in one place.
                </p>
              </div>
              {pack && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/40 px-2 py-1 text-emerald-300">
                    Marketability: {pack.marketability.score_1_to_10.toFixed(1)}{" "}
                    / 10
                  </span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="mb-3 flex flex-wrap gap-1 border-b border-slate-800 pb-1">
              {([
                ["listing", "Listing"],
                ["social", "Social"],
                ["emails", "Emails"],
                ["talking", "Talking points"],
                ["insights", "Insights"],
                ["pitch", "Open house pitch"],
              ] as [TabId, string][]).map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    activeTab === id
                      ? "bg-sky-500 text-slate-950"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto rounded-xl bg-slate-950/40 border border-slate-800 p-3 sm:p-4 text-sm">
              {!pack && (
                <p className="text-slate-500 text-xs">
                  Paste property details on the left and click “Generate
                  Intelligence Pack” to see results here.
                </p>
              )}

              {pack && activeTab === "listing" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xs font-semibold text-slate-200">
                        Long listing description
                      </h3>
                      <button
                        onClick={() => copyText(pack.listing.long)}
                        className="text-[11px] text-sky-300 hover:text-sky-200"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-line">
                      {pack.listing.long}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xs font-semibold text-slate-200">
                        Short listing description
                      </h3>
                      <button
                        onClick={() => copyText(pack.listing.short)}
                        className="text-[11px] text-sky-300 hover:text-sky-200"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-line">
                      {pack.listing.short}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-xs font-semibold text-slate-200">
                        Feature bullets
                      </h3>
                      <button
                        onClick={() =>
                          copyText(pack.listing.bullets.join("\n"))
                        }
                        className="text-[11px] text-sky-300 hover:text-sky-200"
                      >
                        Copy
                      </button>
                    </div>
                    <ul className="list-disc pl-4 text-slate-200">
                      {pack.listing.bullets.map((b) => (
                        <li key={b} className="mb-1">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {pack && activeTab === "social" && (
                <div className="space-y-4">
                  {([
                    ["Instagram caption", pack.social.instagram_caption],
                    ["Facebook post", pack.social.facebook_post],
                    ["LinkedIn post", pack.social.linkedin_post],
                    [
                      "TikTok hook & script",
                      `${pack.social.tiktok_hook}\n\n${pack.social.tiktok_script}`,
                    ],
                  ] as const).map(([label, text]) => (
                    <div key={label}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-xs font-semibold text-slate-200">
                          {label}
                        </h3>
                        <button
                          onClick={() => copyText(text)}
                          className="text-[11px] text-sky-300 hover:text-sky-200"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-slate-200 whitespace-pre-line">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {pack && activeTab === "emails" && (
                <div className="space-y-4">
                  {([
                    ["Buyer outreach email", pack.emails.buyer_email],
                    ["Seller outreach email", pack.emails.seller_email],
                  ] as const).map(([label, text]) => (
                    <div key={label}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-xs font-semibold text-slate-200">
                          {label}
                        </h3>
                        <button
                          onClick={() => copyText(text)}
                          className="text-[11px] text-sky-300 hover:text-sky-200"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-slate-200 whitespace-pre-line">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {pack && activeTab === "talking" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200 mb-1">
                      Highlights
                    </h3>
                    <ul className="list-disc pl-4 text-slate-200 text-sm">
                      {pack.talking_points.highlights.map((h) => (
                        <li key={h} className="mb-1">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200 mb-1">
                      Objections & responses
                    </h3>
                    <div className="space-y-3 text-sm">
                      {pack.talking_points.buyer_concerns.map((c, idx) => (
                        <div key={c}>
                          <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">
                            Concern
                          </p>
                          <p className="text-slate-200 mb-1">{c}</p>
                          <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">
                            Suggested response
                          </p>
                          <p className="text-slate-200">
                            {pack.talking_points.responses[idx]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {pack && activeTab === "insights" && (
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200 mb-1">
                      Marketability summary
                    </h3>
                    <p className="text-slate-200">
                      {pack.marketability.summary}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200 mb-1">
                      Improvement suggestions
                    </h3>
                    <ul className="list-disc pl-4 text-slate-200">
                      {pack.marketability.improvement_suggestions.map((s) => (
                        <li key={s} className="mb-1">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 mb-1">
                        Style & amenities
                      </h3>
                      <p className="text-slate-300 mb-1">
                        Interior style:{" "}
                        <span className="text-sky-300">
                          {pack.vision_features.interior_style}
                        </span>
                      </p>
                      <ul className="list-disc pl-4 text-slate-200">
                        {pack.vision_features.notable_amenities.map((a) => (
                          <li key={a} className="mb-1">
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 mb-1">
                        Exterior & ideal buyer
                      </h3>
                      <ul className="list-disc pl-4 text-slate-200 mb-2">
                        {pack.vision_features.exterior_notes.map((n) => (
                          <li key={n} className="mb-1">
                            {n}
                          </li>
                        ))}
                      </ul>
                      <p className="text-slate-300">
                        <span className="text-slate-400 text-xs uppercase tracking-wide">
                          Ideal buyer:&nbsp;
                        </span>
                        {pack.vision_features.potential_ideal_buyer}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {pack && activeTab === "pitch" && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-xs font-semibold text-slate-200">
                      Open house pitch
                    </h3>
                    <button
                      onClick={() => copyText(pack.open_house_pitch)}
                      className="text-[11px] text-sky-300 hover:text-sky-200"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-slate-200 whitespace-pre-line">
                    {pack.open_house_pitch}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
