"use client";

import { useState, ChangeEvent } from "react";

export default function Home() {
  const [inputMode, setInputMode] = useState<"transcript" | "video">(
    "transcript"
  );
  const [transcript, setTranscript] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>("");
  const [decisions, setDecisions] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);

  const handleAnalyze = async () => {
  setLoading(true);

  try {
    const response = await fetch("/api/meeting-intelligence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: transcript,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Backend connection failed");
    }

    console.log("Backend Response:", data);

    setSummary(data.summary || "");
    setDecisions(data.decisions || []);
    setActionItems(data.actionItems || []);
  } catch (error) {
    console.error("API Error:", error);
    setSummary("Failed to connect with backend.");
  } finally {
    setLoading(false);
  }
};
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
  };

  const isButtonDisabled =
    loading ||
    (inputMode === "transcript" && transcript.trim() === "") ||
    (inputMode === "video" && videoFile === null);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        AI Meeting-to-Action Intelligence Agent
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* INPUT SECTION */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setInputMode("transcript")}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                inputMode === "transcript"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Paste Transcript
            </button>

            <button
              type="button"
              onClick={() => setInputMode("video")}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm ${
                inputMode === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Upload Meeting Video
            </button>
          </div>

          {/* TRANSCRIPT INPUT */}
          {inputMode === "transcript" && (
            <textarea
              className="flex-1 w-full min-h-[350px] border border-gray-300 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your messy meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          )}

          {/* VIDEO INPUT */}
          {inputMode === "video" && (
            <div className="flex-1 min-h-[350px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileChange}
                className="text-sm"
              />

              {videoFile && (
                <p className="text-sm text-gray-600 mt-3">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>
          )}

          {/* ANALYZE BUTTON */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isButtonDisabled}
            className={`mt-4 font-semibold py-3 rounded-lg transition ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Meeting"}
          </button>
        </div>

        {/* OUTPUT SECTION */}
        <div className="flex flex-col gap-6">
          {/* SUMMARY */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-blue-700 mb-2">
              Summary
            </h2>

            <p className="text-gray-700 text-sm">
              {summary || "Summary will appear here after analysis."}
            </p>
          </div>

          {/* DECISIONS */}
          <div className="bg-green-50 border border-green-200 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-green-700 mb-2">
              Key Decisions
            </h2>

            {decisions.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {decisions.map((decision, index) => (
                  <li key={index}>{decision}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                Decisions will appear here.
              </p>
            )}
          </div>

          {/* ACTION ITEMS */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-orange-700 mb-2">
              Action Items
            </h2>

            {actionItems.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {actionItems.map((actionItem, index) => (
                  <li key={index}>{actionItem}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">
                Action items will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}