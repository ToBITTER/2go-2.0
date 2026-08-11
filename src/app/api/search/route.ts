import { NextRequest, NextResponse } from "next/server";
import { searchDirectory } from "@/lib/store";

export async function GET(request: NextRequest) {
  const query = String(request.nextUrl.searchParams.get("q") ?? "");
  const payload = await searchDirectory(query);
  return NextResponse.json(payload);
}
