import { NextRequest, NextResponse } from "next/server";
import { isUsernameAvailable } from "@/lib/store";

export async function GET(request: NextRequest) {
  const username = String(request.nextUrl.searchParams.get("username") ?? "").trim();
  if (username.length < 3) {
    return NextResponse.json({ error: "Username too short" }, { status: 400 });
  }

  const available = await isUsernameAvailable(username);
  return NextResponse.json({ available });
}
