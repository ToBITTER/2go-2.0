import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, listRooms } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);

  const rooms = await listRooms(user?.id);
  return NextResponse.json({ rooms });
}
