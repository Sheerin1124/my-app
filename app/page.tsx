"use client";

import { useState } from "react";

export default function Home() {
  const [inputMode, setInputMode] = useState("transcript");
  const [transcript, setTranscript] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [decisions, setDecisions] = useState([]);
  const [actionItems, setActionItems] = useState([]);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setSummary("This is a test summary. Backend not connected yet.");
      setDecisions(["Test decision 1", "Test decision 2"]);
      setActionItems(["Test action item 1", "Test action item 2"]);
      setLoading(false);
    }, 1000);
  };

  const isButtonDisabled =
    loading ||
    (inputMode === "transcript" && !transcript) ||
    (inputMode === "video" && !videoFile);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        AI Meeting-to-Action Intelligence Agent
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputMode("transcript")}
              className="flex-1 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white"
            >
              Paste Transcript
            </button>
            <button
              onClick={() => setInputMode("video")}
              className="flex-1 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-600"
            >
              Upload Meeting Video
            </button>
          </div>

          {inputMode === "transcript" && (
            <textarea
              className="flex-1 w-full min-h-[350px] border border-gray-300 rounded-lg p-4 text-sm"
              placeholder="Paste your messy meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          )}

          {inputMode === "video" && (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*,audio/*"
                onChange={(e) => setVideoFile(e.target.files[0] || null)}
                className="text-sm"
              />
              {videoFile && (
                <p className="text-sm text-gray-600 mt-3">
                  Selected: {videoFile.name}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isButtonDisabled}
            className="mt-4 bg-blue-600 text-white font-semibold py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Analyze Meeting"}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-blue-700 mb-2">Summary</h2>
            <p className="text-gray-700 text-sm">
              {summary || "Summary will appear here after analysis."}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-green-700 mb-2">Key Decisions</h2>
            {decisions.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {decisions.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Decisions will appear here.</p>
            )}
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold text-orange-700 mb-2">Action Items</h2>
            {actionItems.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {actionItems.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Action items will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}