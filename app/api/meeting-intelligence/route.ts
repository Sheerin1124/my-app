import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
 
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
 
interface ActionItem {
  task: string;
  owner: string | null;
  dueDate: string | null; // ISO date if inferable, else null
  priority: "high" | "medium" | "low";
  context: string;
}

interface MeetingIntelligence {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  followUps: string[];
}
 
const SYSTEM_PROMPT = `You are a meeting-intelligence agent. Given a raw meeting transcript, extract:
1. A concise summary (2-4 sentences)
2. Key decisions made (bullet list of strings)
3. Action items — for each: the task, the owner (person's name if stated, else null), a due date (ISO "YYYY-MM-DD" if a date/timeframe is mentioned and inferable, else null), a priority ("high" | "medium" | "low") based on urgency language, and short context (the sentence/phrase it came from).
4. Open follow-ups or unresolved questions (bullet list of strings)
 
Respond with ONLY valid JSON matching this exact shape, no prose, no markdown fences:
{
  "summary": string,
  "decisions": string[],
  "actionItems": [
    { "task": string, "owner": string | null, "dueDate": string | null, "priority": "high" | "medium" | "low", "context": string }
  ],
  "followUps": string[]
}`;
 
function extractJson(text: string): string {
  // Strip accidental markdown fences if the model adds them anyway.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1].trim() : text.trim();
}
 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, meetingTitle, attendees } = body as {
      transcript?: string;
      meetingTitle?: string;
      attendees?: string[];
    };
 
    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 20) {
      return NextResponse.json(
        { error: "A meeting transcript of reasonable length is required." },
        { status: 400 }
      );
    }
 
    const userContent = [
      meetingTitle ? `Meeting title: ${meetingTitle}` : null,
      attendees?.length ? `Attendees: ${attendees.join(", ")}` : null,
      `Today's date (for resolving relative dates like "next Friday"): ${new Date().toISOString().slice(0, 10)}`,
      "",
      "Transcript:",
      transcript,
    ]
      .filter(Boolean)
      .join("\n");
 
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });
 
    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No text response from model." }, { status: 502 });
    }
 
    let parsed: MeetingIntelligence;
    try {
      parsed = JSON.parse(extractJson(textBlock.text));
    } catch {
      return NextResponse.json(
        { error: "Failed to parse model output as JSON.", raw: textBlock.text },
        { status: 502 }
      );
    }
 
    return NextResponse.json({ success: true, data: parsed });
  } catch (err: any) {
    console.error("meeting-intelligence error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error." },
      { status: 500 }
    );
  }
}
 