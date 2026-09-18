import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const transcript = body.transcript;

    console.log("Transcript received:", transcript);

    if (!transcript || !transcript.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Transcript is empty",
        },
        { status: 400 }
      );
    }

    // Demo analysis
    const summary =
      "The meeting discussed project progress, pending payment integration, notification issues, and testing preparation.";

    const decisions = [
      "Payment integration must be completed by next Wednesday.",
      "The notification issue should be fixed by Monday.",
      "Testing preparation will start this week.",
    ];

    const actionItems = [
      "John: Complete the user profile section by Friday.",
      "Sarah: Complete the payment integration by next Wednesday.",
      "John: Fix the notification issue by Monday.",
      "Sarah: Prepare the testing checklist by Thursday.",
    ];

    return NextResponse.json({
      success: true,
      summary,
      decisions,
      actionItems,
    });
  } catch (error) {
    console.error("Backend Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}