import { NextResponse } from "next/server";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set("2go_session", token, {
    httpOnly: true,
    sameSite: isProduction() ? "none" : "lax",
    secure: isProduction(),
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set("2go_session", "", {
    httpOnly: true,
    sameSite: isProduction() ? "none" : "lax",
    secure: isProduction(),
    path: "/",
    maxAge: 0,
  });
}
