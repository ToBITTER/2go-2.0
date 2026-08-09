import type { Request, Response } from "express";

export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : undefined;
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie("2go_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie("2go_session", {
    path: "/",
  });
}
