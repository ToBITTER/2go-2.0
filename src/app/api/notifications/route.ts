import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, getUnreadNotificationCount, listNotifications } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get("2go_session")?.value);
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [unreadCount, notifications] = await Promise.all([
    getUnreadNotificationCount(user.id),
    listNotifications(user.id),
  ]);

  return NextResponse.json({ unreadCount, notifications });
}
