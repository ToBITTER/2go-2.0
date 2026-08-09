import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, listRooms } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const rooms = await listRooms();
  return NextResponse.json({ rooms });
}
