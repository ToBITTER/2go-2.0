import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, listUsers } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const currentUser = await getUserFromSession(cookieStore.get("2go_session")?.value);
  const users = await listUsers(currentUser?.id);
  return NextResponse.json({ users });
}
