import type { IncomingMessage } from "http";

export function getCookieFromHeader(cookieHeader: string | undefined, name: string) {
  if (!cookieHeader) return undefined;
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const found = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.slice(name.length + 1)) : undefined;
}

export function getSessionTokenFromRequest(request: IncomingMessage) {
  return getCookieFromHeader(request.headers.cookie, "2go_session");
}
