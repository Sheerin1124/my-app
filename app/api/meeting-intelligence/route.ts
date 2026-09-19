import { NextResponse } from "next/server";

type ActionItem = {
  task: string;
  owner: string;
  deadline: string;
};

function extractDecisions(transcript: string): string[] {
  const decisions: string[] = [];

  const lines = transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (
      lower.includes("agreed") ||
      lower.includes("decided") ||
      lower.includes("decision") ||
      lower.includes("let's go with") ||
      lower.includes("approved") ||
      lower.includes("will use")
    ) {
      const clean = line.replace(/^[^:]+:\s*/, "").trim();

      if (clean && !decisions.includes(clean)) {
        decisions.push(clean);
      }
    }
  }

  return decisions.slice(0, 5);
}

function extractActionItems(transcript: string): ActionItem[] {
  const items: ActionItem[] = [];

  const lines = transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const lower = line.toLowerCase();

    const isAction =
      lower.includes("will ") ||
      lower.includes("need to") ||
      lower.includes("should ") ||
      lower.includes("complete") ||
      lower.includes("prepare") ||
      lower.includes("review") ||
      lower.includes("fix ") ||
      lower.includes("test ");

    if (!isAction) continue;

    const parts = line.split(":");

    let owner = "Unassigned";
    let task = line;

    if (parts.length >= 2) {
      owner = parts[0].trim();
      task = parts.slice(1).join(":").trim();
    }

    let deadline = "No deadline";

    const deadlineMatch = task.match(
      /\b(by|before|on)\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|today|tomorrow)\b/i
    );

    if (deadlineMatch) {
      deadline = deadlineMatch[0];
    }

    if (task.length > 10) {
      items.push({
        task,
        owner,
        deadline,
      });
    }
  }

  return items.slice(0, 10);
}

function createSummary(transcript: string): string {
  const lines = transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return "No meeting content was provided.";
  }

  const topicLines = lines
    .filter((line) => !line.toLowerCase().includes("thanks"))
    .slice(0, 3);

  return `The meeting covered project progress, responsibilities, decisions, and upcoming tasks. Key discussion points included: ${topicLines
    .map((line) => line.replace(/^[^:]+:\s*/, ""))
    .join(" ")}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transcript = body?.transcript;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        {
          error: "Transcript is required",
        },
        {
          status: 400,
        }
      );
    }

    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      return NextResponse.json(
        {
          error: "Transcript cannot be empty",
        },
        {
          status: 400,
        }
      );
    }

    const summary = createSummary(cleanTranscript);
    const decisions = extractDecisions(cleanTranscript);
    const action_items = extractActionItems(cleanTranscript);

    return NextResponse.json({
      success: true,
      summary,
      decisions,
      action_items,
    });
  } catch (error) {
    console.error("Meeting Intelligence API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to process the meeting transcript.",
      },
      {
        status: 500,
      }
    );
  }
}