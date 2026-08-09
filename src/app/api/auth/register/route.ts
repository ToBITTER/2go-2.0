import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSession, createUser } from "@/lib/store";
import { setSessionCookie } from "@/lib/http";

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });
  }

  try {
    const user = await createUser(parsed.data);
    const token = await createSession(user.id);
    const response = NextResponse.json({ user }, { status: 201 });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to register" },
      { status: 409 },
    );
  }
}
