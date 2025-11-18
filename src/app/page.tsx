"use client";

import { useState } from "react";
import Image from "next/image";
import { MOCK_PACK } from "../mock/verisMock";
import { VerisIntelligencePack } from "../types/veris";

type TabId = "listing" | "social" | "emails" | "talking" | "insights" | "pitch";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("listing");
  const [propertyText, setPropertyText] = useState("");
  const [pack, setPack] = useState<VerisIntelligencePack | null>(MOCK_PACK);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1800);
  };

  const handleGenerate = async () => {
    if (!propertyText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyText }),
      });

      if (!res.ok) {
        console.error("API error", await res.text());
        showToast("Using demo output (API error)");
        setPack(MOCK_PACK);
        return;
      }

      const data: VerisIntelligencePack = await res.json();
      setPack(data);
      showToast("Intelligence pack updated");
    } catch (err) {
      console.error("Request failed", err);
      showToast("Using demo output (network error)");
      setPack(MOCK_PACK);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    } catch (err) {
      console.error("Failed to copy", err);
      showToast("Copy failed");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* soft futuristic background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_55%),_radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.3),_transparent_60%)]" />

      {/* simple toast */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center">
          <div className="pointer-events-auto rounded-full border border-slate-700 bg-slate-900/95 px-4 py-1.5 text-xs text-slate-100 shadow-lg">
            {toast}
          </div>
        </div>
      )}

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
        {/* HEADER */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* mobile: icon + text */}
            <div className="flex items-center gap-2 sm:hidden">
              <Image
                src="/veris-logo-mark.png"
                alt="Veris Automation"
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
                priority
              />
              <span className="text-base font-semibold tracking-tight">
                Veris Automation
              </span>
            </div>

            {/* desktop: full wordmark - BIG */}
            <div className="hidden items-center gap-4 sm:flex">
              <Image
                src="/veris-logo-wordmark.png"
                alt="Veris Automation"
                width={640}
                height={190}
                className="h-24 w-auto object-contain drop-shadow-[0_0_32px_rgba(56,189,248,0.75)]"
                priority
              />
              <span className="inline-flex items-center rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-200">
                Agent preview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <div className="hidden items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span>Models online</span>
            </div>
            <button className="rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-[11px] hover:border-sky-400 hover:text-sky-200">
              Feedback
            </button>
          </div>
        </header>

        {/* BODY LAYOUT */}
        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          {/* LEFT: INPUT PANEL */}
          <section className="w-full lg:w-[40%]">
            <div className="h-full rounded-2xl border border-slate-800/80 bg-slate-950/75 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              <div className="border-b border-slate-800/80 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                      Input
                    </p>
                    <p className="text-xs text-slate-400">
                      One description in, full intelligence pack out.
                    </p>
                  </div>
                  <div className="hidden flex-col items-end text-[10px] text-slate-500 sm:flex">
                    <span>Mode: Listing marketing</span>
                    <span>Output: Multi-channel content</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
                {/* text area */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Property details
                  </label>
                  <p className="mb-2 text-[11px] text-slate-500">
                    Paste an address, MLS remarks, or rough notes. Veris rewrites
                    everything into polished, ready-to-use language.
                  </p>
                  <textarea
                    className="h-44 w-full resize-none rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500/80"
                    placeholder={`1234 Ocean View Dr, San Diego, CA 92130\n\n3 bed, 2.5 bath modern coastal home with open-concept layout, chef's kitchen, and indoor-outdoor flow...`}
                    value={propertyText}
                    onChange={(e) => setPropertyText(e.target.value)}
                  />
                </div>

                {/* photos placeholder */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-slate-200">
                      Property photos
                    </label>
                    <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] text-slate-500">
                      Vision support coming soon
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-slate-700/80 bg-slate-950/60 px-3 py-4 text-center">
                    <div>
                      <p className="text-xs text-slate-400">
                        Drag and drop listing photos here
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Soon, Veris will read finishes, style, and amenities and
                        tune your copy automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* primary CTA */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !propertyText.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-[0_18px_50px_rgba(56,189,248,0.45)] transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border border-slate-900 border-t-slate-50" />
                        Analyzing with Veris…
                      </>
                    ) : (
                      <span>Generate Intelligence Pack</span>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-500">
                    Outputs stay in this session during preview. Model calls are
                    powered by OpenAI and tuned for real-estate workflows.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: OUTPUT PANEL */}
          <section className="w-full lg:w-[60%]">
            <div className="flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-950/75 shadow-[0_0_0_1px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              {/* header */}
              <div className="border-b border-slate-800/80 px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                      Veris intelligence pack
                    </p>
                    <p className="text-xs text-slate-400">
                      Listing copy, social, email, talking points, and insights in
                      one place.
                    </p>
                  </div>
                  {pack && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-1 font-medium text-emerald-200">
                        Marketability{" "}
                        {pack.marketability.score_1_to_10.toFixed(1)} / 10
                      </span>
                      <span className="hidden text-slate-500 sm:inline">
                        Drafts are fully editable — start here, then tune for your
                        voice.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* tabs */}
              <div className="border-b border-slate-800/80 px-3 pb-1 pt-2 sm:px-4">
                <div className="flex flex-wrap gap-1">
                  {(
                    [
                      ["listing", "Listing"],
                      ["social", "Social"],
                      ["emails", "Emails"],
                      ["talking", "Talking points"],
                      ["insights", "Insights"],
                      ["pitch", "Open house pitch"],
                    ] as [TabId, string][]
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`rounded-full px-3 py-1 text-[11px] transition ${
                        activeTab === id
                          ? "bg-sky-500 text-slate-950"
                          : "bg-slate-900/80 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* content */}
              <div className="flex-1 overflow-y-auto px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                <div className="h-full rounded-xl border border-slate-800/80 bg-slate-950/85 p-3 text-sm sm:p-4">
                  {!pack && (
                    <p className="text-xs text-slate-500">
                      Paste property details on the left and click{" "}
                      <span className="font-medium text-slate-300">
                        Generate Intelligence Pack
                      </span>{" "}
                      to see drafts here.
                    </p>
                  )}

                  {/* LISTING TAB */}
                  {pack && activeTab === "listing" && (
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Long listing description
                          </h3>
                          <button
                            onClick={() => copyText(pack.listing.long)}
                            className="text-[11px] text-sky-300 hover:text-sky-200"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                          {pack.listing.long}
                        </p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Short description
                          </h3>
                          <button
                            onClick={() => copyText(pack.listing.short)}
                            className="text-[11px] text-sky-300 hover:text-sky-200"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="whitespace-pre-line text-sm text-slate-200">
                          {pack.listing.short}
                        </p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-3">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
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
                        <ul className="list-disc space-y-1 pl-4 text-slate-200">
                          {pack.listing.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* SOCIAL TAB */}
                  {pack && activeTab === "social" && (
                    <div className="space-y-4">
                      {(
                        [
                          ["Instagram caption", pack.social.instagram_caption],
                          ["Facebook post", pack.social.facebook_post],
                          ["LinkedIn post", pack.social.linkedin_post],
                          [
                            "TikTok hook & script",
                            `${pack.social.tiktok_hook}\n\n${pack.social.tiktok_script}`,
                          ],
                        ] as const
                      ).map(([label, text]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3"
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              {label}
                            </h3>
                            <button
                              onClick={() => copyText(text)}
                              className="text-[11px] text-sky-300 hover:text-sky-200"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="whitespace-pre-line text-sm text-slate-200">
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* EMAILS TAB */}
                  {pack && activeTab === "emails" && (
                    <div className="space-y-4">
                      {(
                        [
                          ["Buyer outreach email", pack.emails.buyer_email],
                          ["Seller outreach email", pack.emails.seller_email],
                        ] as const
                      ).map(([label, text]) => (
                        <div
                          key={label}
                          className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3"
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                              {label}
                            </h3>
                            <button
                              onClick={() => copyText(text)}
                              className="text-[11px] text-sky-300 hover:text-sky-200"
                            >
                              Copy
                            </button>
                          </div>
                          <p className="whitespace-pre-line text-sm text-slate-200">
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TALKING POINTS TAB */}
                  {pack && activeTab === "talking" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Highlights
                        </h3>
                        <ul className="list-disc space-y-1 pl-4 text-sm text-slate-200">
                          {pack.talking_points.highlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Objections & responses
                        </h3>
                        <div className="space-y-3 text-sm">
                          {pack.talking_points.buyer_concerns.map((c, idx) => (
                            <div
                              key={c}
                              className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-2.5"
                            >
                              <p className="mb-0.5 text-[11px] font-medium text-slate-400">
                                Buyer concern
                              </p>
                              <p className="mb-1 text-slate-200">{c}</p>
                              <p className="mb-0.5 text-[11px] font-medium text-slate-400">
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

                  {/* INSIGHTS TAB */}
                  {pack && activeTab === "insights" && (
                    <div className="space-y-4 text-sm">
                      <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3">
                        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Marketability summary
                        </h3>
                        <p className="text-slate-200">
                          {pack.marketability.summary}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3">
                        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Improvement suggestions
                        </h3>
                        <ul className="list-disc space-y-1 pl-4 text-slate-200">
                          {pack.marketability.improvement_suggestions.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3">
                          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Style & amenities
                          </h3>
                          <p className="mb-1 text-slate-300">
                            Interior style:{" "}
                            <span className="text-sky-300">
                              {pack.vision_features.interior_style}
                            </span>
                          </p>
                          <ul className="list-disc space-y-1 pl-4 text-slate-200">
                            {pack.vision_features.notable_amenities.map((a) => (
                              <li key={a}>{a}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-lg border border-slate-800/80 bg-slate-950/70 p-3">
                          <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Exterior & ideal buyer
                          </h3>
                          <ul className="mb-2 list-disc space-y-1 pl-4 text-slate-200">
                            {pack.vision_features.exterior_notes.map((n) => (
                              <li key={n}>{n}</li>
                            ))}
                          </ul>
                          <p className="text-slate-300">
                            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                              Ideal buyer:&nbsp;
                            </span>
                            {pack.vision_features.potential_ideal_buyer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PITCH TAB */}
                  {pack && activeTab === "pitch" && (
                    <div className="space-y-3 text-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Open house pitch
                        </h3>
                        <button
                          onClick={() => copyText(pack.open_house_pitch)}
                          className="text-[11px] text-sky-300 hover:text-sky-200"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="whitespace-pre-line text-slate-200">
                        {pack.open_house_pitch}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
