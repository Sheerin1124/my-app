"use client";

import { useState } from "react";

type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

type MeetingResult = {
  summary: string;
  decisions: string[];
  action_items: ActionItem[];
};

const sampleTranscript = `Project Manager: Thanks everyone for joining. We need to finalize the mobile application release plan today.

Developer: The login module is almost complete. I will fix the remaining authentication bug by Friday.

Designer: The new dashboard design is ready. We agreed to use the blue and white theme across the application.

Project Manager: Good. Let's go with that design. We also need the final dashboard screens reviewed before the release.

QA Lead: I can test the login and dashboard modules. I will complete testing by Monday.

Developer: I will also prepare the deployment build once QA finishes testing.

Project Manager: Great. So the decisions are the blue and white theme and releasing after QA approval.`;

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeMeeting() {
    if (!transcript.trim()) {
      setError("Please enter a meeting transcript first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/meeting-intelligence",  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to analyze meeting.");
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function loadSample() {
    setTranscript(sampleTranscript);
    setResult(null);
    setError("");
  }

  function clearAll() {
    setTranscript("");
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Meeting<span className="text-blue-400">AI</span>
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              AI Meeting-to-Action Intelligence Agent
            </p>
          </div>

          <div className="hidden rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-medium text-blue-300 sm:block">
            G13 • Meeting Intelligence
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Turn messy meetings into clear actions.
          </h2>

          <p className="mt-2 max-w-2xl text-slate-400">
            Paste your meeting transcript and let AI extract the
            summary, decisions, and action items automatically.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Side */}
          <section className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Meeting Transcript
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Paste your raw meeting conversation below.
                </p>
              </div>

              <button
                type="button"
                onClick={loadSample}
                className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-3 py-2 text-xs font-medium text-blue-300 hover:bg-blue-400/20"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                setError("");
              }}
              placeholder="Paste meeting transcript here..."
              className="h-[430px] w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-4 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-400/60"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={analyzeMeeting}
                disabled={loading}
                className="flex-1 rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Analyzing Meeting..." : "Analyze Meeting"}
              </button>

              <button
                type="button"
                onClick={clearAll}
                className="rounded-xl border border-white/10 px-5 py-3 font-medium text-slate-300 hover:bg-white/5"
              >
                Clear
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}
          </section>

          {/* Right Side */}
          <section className="space-y-5">
            {/* Summary */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📝
                </div>

                <div>
                  <h3 className="font-semibold">
                    Meeting Summary
                  </h3>

                  <p className="text-xs text-slate-500">
                    AI-generated overview
                  </p>
                </div>
              </div>

              {result ? (
                <p className="text-sm leading-7 text-slate-300">
                  {result.summary}
                </p>
              ) : (
                <p className="text-sm italic text-slate-600">
                  Your meeting summary will appear here.
                </p>
              )}
            </div>

            {/* Decisions */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-xl">
                  🎯
                </div>

                <div>
                  <h3 className="font-semibold">
                    Key Decisions
                  </h3>

                  <p className="text-xs text-slate-500">
                    Important decisions made
                  </p>
                </div>
              </div>

              {result && result.decisions?.length > 0 ? (
                <div className="space-y-3">
                  {result.decisions.map((decision, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-purple-400/10 bg-purple-400/5 p-3 text-sm leading-6 text-slate-300"
                    >
                      <span className="mr-2 font-semibold text-purple-300">
                        {index + 1}.
                      </span>

                      {decision}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-slate-600">
                  Key decisions will appear here.
                </p>
              )}
            </div>

            {/* Action Items */}
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-xl">
                  ✅
                </div>

                <div>
                  <h3 className="font-semibold">
                    Action Items
                  </h3>

                  <p className="text-xs text-slate-500">
                    Tasks extracted from the meeting
                  </p>
                </div>
              </div>

              {result && result.action_items?.length > 0 ? (
                <div className="space-y-3">
                  {result.action_items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4"
                    >
                      <div className="mb-2 flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-bold text-emerald-300">
                          {index + 1}
                        </div>

                        <p className="text-sm leading-6 text-slate-200">
                          {item.task}
                        </p>
                      </div>

                      <div className="ml-9 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-white/5 px-3 py-1 text-slate-400">
                          👤 {item.owner || "Unassigned"}
                        </span>

                        <span className="rounded-full bg-white/5 px-3 py-1 text-slate-400">
                          📅 {item.deadline || "No deadline"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm italic text-slate-600">
                  Action items will appear here.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-8 pt-4 text-center text-xs text-slate-600">
        G13 • AI Meeting-to-Action Intelligence Agent
      </footer>
    </main>
  );
}