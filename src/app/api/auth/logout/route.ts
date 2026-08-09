import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie } from "@/lib/http";
import { deleteSession } from "@/lib/store";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("2go_session")?.value;
  if (token) await deleteSession(token);
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
