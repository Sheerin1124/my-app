import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Received data:", body);

    return NextResponse.json({
      success: true,

      summary:
        "The meeting discussed project progress and assigned responsibilities to team members.",

      decisions: [
        "Complete frontend and backend development",
        "Test the application before submission",
      ],

      actionItems: [
        "Frontend team to complete UI development",
        "Backend team to complete API integration",
        "Team to test the project",
      ],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong in backend",
      },
      { status: 500 }
    );
  }
}