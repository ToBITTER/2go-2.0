import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, findUserByEmail } from "@/lib/store";
import { setSessionCookie } from "@/lib/http";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login details" }, { status: 400 });
  }

  const user = await findUserByEmail(parsed.data.email);
  if (!user || user.password !== parsed.data.password) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSession(user.id);
  const response = NextResponse.json({ user });
  setSessionCookie(response, token);
  return response;
}
