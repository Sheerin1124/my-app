"use client";

import { useState, ChangeEvent } from "react";

export default function Home() {
  const [inputMode, setInputMode] = useState<"transcript" | "video">(
    "transcript"
  );

  const [transcript, setTranscript] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [decisions, setDecisions] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Analyze Meeting
  const handleAnalyze = async () => {
    if (inputMode === "transcript" && transcript.trim() === "") {
      setError("Please paste a meeting transcript first.");
      return;
    }

    if (inputMode === "video") {
      setError(
        "Video transcription is not connected yet. Please use Paste Transcript for now."
      );
      return;
    }

    setLoading(true);

    // Clear previous results
    setSummary("");
    setDecisions([]);
    setActionItems([]);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
        }),
      });

      const data = await response.json();

      console.log("Backend Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Backend connection failed");
      }

      setSummary(data.summary || "No summary generated.");
      setDecisions(data.decisions || []);
      setActionItems(data.actionItems || []);
    } catch (err) {
      console.error("API Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect with backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // File Upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setError("");
  };

  const isButtonDisabled =
    loading ||
    (inputMode === "transcript" && transcript.trim() === "") ||
    (inputMode === "video" && videoFile === null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl">🤖</span>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              AI Meeting-to-Action
            </h1>

            <p className="text-sm text-slate-500">
              Intelligence Agent
            </p>
          </div>
        </div>

        <p className="text-slate-500 text-sm md:text-base">
          Transform messy meeting conversations into clear summaries,
          decisions, and actionable tasks.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Meeting Input
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Choose how you want to provide your meeting content.
              </p>
            </div>
          </div>

          {/* TABS */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-5">

            <button
              type="button"
              onClick={() => {
                setInputMode("transcript");
                setError("");
              }}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                inputMode === "transcript"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              📝 Paste Transcript
            </button>

            <button
              type="button"
              onClick={() => {
                setInputMode("video");
                setError("");
              }}
              className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all ${
                inputMode === "video"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              🎥 Upload Video
            </button>

          </div>

          {/* TRANSCRIPT */}
          {inputMode === "transcript" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Meeting Transcript
              </label>

              <textarea
                className="w-full min-h-[360px] border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Paste your meeting transcript here...

Example:
Team discussed project progress. Frontend team will complete UI by Friday. Backend team will integrate the API. Everyone agreed to test before submission."
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  setError("");
                }}
              />

              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>AI will analyze your transcript</span>
                <span>{transcript.length} characters</span>
              </div>
            </div>
          )}

          {/* VIDEO UPLOAD */}
          {inputMode === "video" && (
            <div className="min-h-[360px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">

              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <span className="text-3xl">🎬</span>
              </div>

              <h3 className="font-semibold text-slate-700 mb-2">
                Upload Meeting Video
              </h3>

              <p className="text-sm text-slate-500 mb-5">
                Upload MP4, MOV, or audio files.
              </p>

              <input
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileChange}
                className="block w-full max-w-xs text-sm text-slate-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-blue-600 file:text-white
                file:font-semibold
                hover:file:bg-blue-700"
              />

              {videoFile && (
                <div className="mt-5 p-3 bg-white rounded-xl border border-slate-200 w-full max-w-xs">
                  <p className="text-xs text-slate-400">Selected file</p>
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {videoFile.name}
                  </p>
                </div>
              )}

            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* ANALYZE BUTTON */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isButtonDisabled}
            className={`w-full mt-5 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isButtonDisabled
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Analyzing Meeting...
              </>
            ) : (
              <>
                ✨ Analyze Meeting
              </>
            )}
          </button>

        </div>


        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-5">

          {/* SUMMARY CARD */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                📄
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Summary
                </h2>

                <p className="text-xs text-slate-400">
                  AI-generated meeting overview
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-7">
              {summary || "Your meeting summary will appear here after analysis."}
            </p>

          </div>


          {/* DECISIONS CARD */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                🎯
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Key Decisions
                </h2>

                <p className="text-xs text-slate-400">
                  Important decisions made during the meeting
                </p>
              </div>
            </div>

            {decisions.length > 0 ? (
              <ul className="space-y-3">
                {decisions.map((decision, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                Decisions will appear here after analysis.
              </p>
            )}

          </div>


          {/* ACTION ITEMS CARD */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                🚀
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Action Items
                </h2>

                <p className="text-xs text-slate-400">
                  Tasks identified from the meeting
                </p>
              </div>
            </div>

            {actionItems.length > 0 ? (
              <ul className="space-y-3">
                {actionItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <span className="mt-1 w-2 h-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">
                Action items will appear here after analysis.
              </p>
            )}

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="max-w-7xl mx-auto text-center mt-8">
        <p className="text-xs text-slate-400">
          AI-powered meeting intelligence • Built for smarter teamwork
        </p>
      </div>

    </main>
  );
}