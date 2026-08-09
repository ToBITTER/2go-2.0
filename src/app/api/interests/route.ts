import { NextResponse } from "next/server";
import { defaultInterests } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ interests: defaultInterests });
}
