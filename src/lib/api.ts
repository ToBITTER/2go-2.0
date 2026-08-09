export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type RequestOptions = RequestInit & {
  json?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
    body: options.json ? JSON.stringify(options.json) : options.body,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? "Request failed");
  }

  return payload as T;
}

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  rank: string;
  interests: string[];
  picture?: string;
};

export type AuthSession = {
  user: AuthUser;
};

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}) {
  return request<AuthSession>("/api/auth/register", {
    method: "POST",
    json: input,
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return request<AuthSession>("/api/auth/login", {
    method: "POST",
    json: input,
  });
}

export async function updateOnboarding(input: { interests: string[]; bio: string }) {
  return request<AuthSession>("/api/onboarding", {
    method: "POST",
    json: input,
  });
}

export async function updateProfile(input: {
  displayName: string;
  bio: string;
  picture?: string;
}) {
  return request<AuthSession>("/api/profile", {
    method: "PUT",
    json: input,
  });
}

export async function getMe() {
  return request<AuthSession>("/api/auth/me");
}

export async function logoutUser() {
  return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export async function getInterests() {
  return request<{ interests: string[] }>("/api/interests");
}

export async function getProfile(username: string) {
  return request<{ user: AuthUser }>(`/api/profile/${encodeURIComponent(username)}`);
}
