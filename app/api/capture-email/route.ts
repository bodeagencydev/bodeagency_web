import { addEmail, getEmails } from "@/lib/email-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    addEmail(email.trim().toLowerCase());

    return NextResponse.json({ success: true, count: getEmails().length });
  } catch {
    return NextResponse.json({ error: "Failed to capture email." }, { status: 500 });
  }
}
